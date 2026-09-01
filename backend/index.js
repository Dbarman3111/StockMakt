require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const crypto = require("crypto");
const { promisify } = require("util");

const {HoldingsModel } = require("./model/HoldingsModel")
const {PositionsModel} = require('./model/PositionsModel')
const { UserModel } = require("./model/UserModel");
const { OrdersModel } = require("./model/OrdersModel");

const scrypt = promisify(crypto.scrypt);
const sessions = new Map();


const PORT = process.env.PORT || 3002;

const uri = process.env.MONGO_URL;

const app = express();

app.use(cors({ origin: ["http://localhost:3000", "http://localhost:3001"], credentials: true }));
app.use(bodyParser.json());

const createSession = (userId, res) => {
    const sessionToken = crypto.randomBytes(32).toString("hex");
    sessions.set(sessionToken, userId.toString());
    const secureCookie = process.env.NODE_ENV === "production" ? "; Secure" : "";
    res.setHeader("Set-Cookie", `session=${sessionToken}; HttpOnly; SameSite=Lax; Max-Age=604800${secureCookie}; Path=/`);
};

const getSessionUserId = (req) => {
    const cookies = req.headers.cookie || "";
    const sessionToken = cookies.split(";").map((cookie) => cookie.trim()).find((cookie) => cookie.startsWith("session="))?.split("=")[1];
    return sessionToken ? sessions.get(sessionToken) : null;
};

app.post("/signup", async (req, res) => {
    const { fullName, email, phone, password } = req.body;

    if (!fullName || !email || !phone || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }

    if (password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters." });
    }

    try {
        const normalizedEmail = email.trim().toLowerCase();
        const existingUser = await UserModel.findOne({ email: normalizedEmail });

        if (existingUser) {
            return res.status(409).json({ message: "An account with this email already exists." });
        }

        const passwordSalt = crypto.randomBytes(16).toString("hex");
        const passwordHash = (await scrypt(password, passwordSalt, 64)).toString("hex");

        await UserModel.create({
            fullName: fullName.trim(),
            email: normalizedEmail,
            phone: phone.trim(),
            passwordHash,
            passwordSalt,
        });

        const user = await UserModel.findOne({ email: normalizedEmail });
        createSession(user._id, res);
        return res.status(201).json({ message: "Account created successfully." });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: "An account with this email already exists." });
        }

        console.error("Signup failed:", error);
        return res.status(500).json({ message: "Unable to create account right now." });
    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    try {
        const user = await UserModel.findOne({ email: email.trim().toLowerCase() });

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        const passwordHash = (await scrypt(password, user.passwordSalt, 64)).toString("hex");

        if (passwordHash !== user.passwordHash) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        createSession(user._id, res);
        return res.json({ message: "Login successful." });
    } catch (error) {
        console.error("Login failed:", error);
        return res.status(500).json({ message: "Unable to login right now." });
    }
});

app.get("/me", async (req, res) => {
    const userId = getSessionUserId(req);

    if (!userId) {
        return res.status(401).json({ message: "You are not logged in." });
    }

    const user = await UserModel.findById(userId).select("fullName email phone");

    if (!user) {
        return res.status(401).json({ message: "Session expired." });
    }

    return res.json({ user });
});

app.post("/logout", (req, res) => {
    const cookies = req.headers.cookie || "";
    const sessionToken = cookies.split(";").map((cookie) => cookie.trim()).find((cookie) => cookie.startsWith("session="))?.split("=")[1];

    if (sessionToken) {
        sessions.delete(sessionToken);
    }

    const secureCookie = process.env.NODE_ENV === "production" ? "; Secure" : "";
    res.setHeader("Set-Cookie", `session=; HttpOnly; SameSite=Lax; Max-Age=0; Path=/${secureCookie}`);
    return res.json({ message: "Logged out successfully." });
});

app.post("/newOrder", async (req, res) => {
    const { name, qty, price, mode } = req.body;
    const userId = getSessionUserId(req);

    if (!userId) {
        return res.status(401).json({ message: "Please login before placing an order." });
    }

    if (!name || !Number.isFinite(Number(qty)) || Number(qty) <= 0 || !Number.isFinite(Number(price)) || Number(price) <= 0 || !["BUY", "SELL"].includes(mode)) {
        return res.status(400).json({ message: "Valid stock, quantity, price, and order mode are required." });
    }

    try {
        const quantity = Number(qty);
        const tradeValue = quantity * Number(price);
        const user = await UserModel.findById(userId);
        const holding = await HoldingsModel.findOne({ userId, name });

        if (!user) {
            return res.status(401).json({ message: "User account was not found." });
        }

        if (!Number.isFinite(user.availableFunds)) {
            user.availableFunds = 4043.10;
        }

        if (mode === "BUY" && user.availableFunds < tradeValue) {
            return res.status(400).json({ message: "Insufficient available funds." });
        }

        if (mode === "SELL" && (!holding || holding.qty < quantity)) {
            return res.status(400).json({ message: "You do not own enough shares to sell." });
        }

        if (mode === "BUY") {
            const nextQuantity = (holding?.qty || 0) + quantity;
            const nextAverage = holding
                ? ((holding.avg * holding.qty) + tradeValue) / nextQuantity
                : Number(price);

            await HoldingsModel.findOneAndUpdate(
                { userId, name },
                { userId, name, qty: nextQuantity, avg: nextAverage, price: Number(price), net: "0.00%", day: "0.00%" },
                { upsert: true, new: true }
            );
            await PositionsModel.findOneAndUpdate(
                { userId, name },
                { userId, product: "CNC", name, qty: nextQuantity, avg: nextAverage, price: Number(price), net: "0.00%", day: "0.00%", isLoss: false },
                { upsert: true, new: true }
            );
            user.availableFunds -= tradeValue;
        } else {
            const remainingQuantity = holding.qty - quantity;
            if (remainingQuantity === 0) {
                await HoldingsModel.deleteOne({ _id: holding._id });
                await PositionsModel.deleteOne({ userId, name });
            } else {
                await HoldingsModel.updateOne({ _id: holding._id }, { qty: remainingQuantity, price: Number(price) });
                await PositionsModel.updateOne({ userId, name }, { qty: remainingQuantity, price: Number(price) });
            }
            user.availableFunds += tradeValue;
        }

        await user.save();
        const order = await OrdersModel.create({ userId, name, qty: quantity, price: Number(price), mode });
        return res.status(201).json(order);
    } catch (error) {
        console.error("Order creation failed:", error);
        return res.status(500).json({ message: error.message || "Unable to place order right now." });
    }
});

// app.get('/addHolding', async(req, res)=>{
//     let tempHoldings =[
//   {
//     name: "BHARTIARTL",
//     qty: 2,
//     avg: 538.05,
//     price: 541.15,
//     net: "+0.58%",
//     day: "+2.99%",
//   },
//   {
//     name: "HDFCBANK",
//     qty: 2,
//     avg: 1383.4,
//     price: 1522.35,
//     net: "+10.04%",
//     day: "+0.11%",
//   },
//   {
//     name: "HINDUNILVR",
//     qty: 1,
//     avg: 2335.85,
//     price: 2417.4,
//     net: "+3.49%",
//     day: "+0.21%",
//   },
//   {
//     name: "INFY",
//     qty: 1,
//     avg: 1350.5,
//     price: 1555.45,
//     net: "+15.18%",
//     day: "-1.60%",
//     isLoss: true,
//   },
//   {
//     name: "ITC",
//     qty: 5,
//     avg: 202.0,
//     price: 207.9,
//     net: "+2.92%",
//     day: "+0.80%",
//   },
//   {
//     name: "KPITTECH",
//     qty: 5,
//     avg: 250.3,
//     price: 266.45,
//     net: "+6.45%",
//     day: "+3.54%",
//   },
//   {
//     name: "M&M",
//     qty: 2,
//     avg: 809.9,
//     price: 779.8,
//     net: "-3.72%",
//     day: "-0.01%",
//     isLoss: true,
//   },
//   {
//     name: "RELIANCE",
//     qty: 1,
//     avg: 2193.7,
//     price: 2112.4,
//     net: "-3.71%",
//     day: "+1.44%",
//   },
//   {
//     name: "SBIN",
//     qty: 4,
//     avg: 324.35,
//     price: 430.2,
//     net: "+32.63%",
//     day: "-0.34%",
//     isLoss: true,
//   },
//   {
//     name: "SGBMAY29",
//     qty: 2,
//     avg: 4727.0,
//     price: 4719.0,
//     net: "-0.17%",
//     day: "+0.15%",
//   },
//   {
//     name: "TATAPOWER",
//     qty: 5,
//     avg: 104.2,
//     price: 124.15,
//     net: "+19.15%",
//     day: "-0.24%",
//     isLoss: true,
//   },
//   {
//     name: "TCS",
//     qty: 1,
//     avg: 3041.7,
//     price: 3194.8,
//     net: "+5.03%",
//     day: "-0.25%",
//     isLoss: true,
//   },
//   {
//     name: "WIPRO",
//     qty: 4,
//     avg: 489.3,
//     price: 577.75,
//     net: "+18.08%",
//     day: "+0.32%",
//   },
// ];

//  tempHoldings.forEach((item)=>{
//         let newHolding = new HoldingsModel({
//             name: item.name,
//             qty: item.qty,
//             avg: item.avg,
//             price: item.price,
//             net: item.day,
//             day: item.day,
//         });

//         newHolding.save();
//  });
//  res.send("Done!")
// })



// app.get('/addPositions', async(req , res)=>{
//     let tempPositions = [
//   {
//     product: "CNC",
//     name: "EVEREADY",
//     qty: 2,
//     avg: 316.27,
//     price: 312.35,
//     net: "+0.58%",
//     day: "-1.24%",
//     isLoss: true,
//   },
//   {
//     product: "CNC",
//     name: "JUBLFOOD",
//     qty: 1,
//     avg: 3124.75,
//     price: 3082.65,
//     net: "+10.04%",
//     day: "-1.35%",
//     isLoss: true,
//   },
// ];

//  tempPositions.forEach((item)=>{
//         let newPosition = new PositionsModel({
//            product: item.product,
//            name: item.name,
//            qty: item.qty,
//            avg: item.avg,
//            price: item.price,
//            net: item.net,
//            day: item.day,
//            isLoss: item.isLoss,
//         });

//         newPosition.save();
//  });
//  res.send("Done!")
// })
 


app.get('/allHoldings', async(req , res)=>{
    const userId = getSessionUserId(req);
    if (!userId) return res.status(401).json({ message: "Please login first." });
    let allHoldings = await HoldingsModel.find({ userId });
    res.json(allHoldings);
})
app.get('/allPositions', async(req , res)=>{
    const userId = getSessionUserId(req);
    if (!userId) return res.status(401).json({ message: "Please login first." });
    let allPositions = await PositionsModel.find({ userId });
    res.json(allPositions);
})

app.get('/funds', async(req, res) => {
    const userId = getSessionUserId(req);
    if (!userId) return res.status(401).json({ message: "Please login first." });
    const user = await UserModel.findById(userId).select("availableFunds");
    return res.json({ availableFunds: user?.availableFunds || 0 });
});



mongoose.connect(uri)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`App started on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
        process.exitCode = 1;
    });