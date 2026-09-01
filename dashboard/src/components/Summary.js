import React from "react";
import { useState, useEffect } from "react";
import axios from "../config/axiosConfig";
import { Link } from "react-router-dom";

const Summary = () => {
  const [ holdingsCount , setHoldingsCount ] = useState(0);
  const [ marginAvailable, setMarginAvailable] = useState(0);
  const [user , setUser] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [portfolio, setPortfolio] = useState({
    currentValue: 0,
    investment: 0,
    pnl: 0,
    pnlPercent: 0,
  });
  const [marginsUsed, setMarginsUsed] = useState(0);
  const [error, setError] = useState(null);


  // Fetch user info
  useEffect(()=>{
    axios.get("http://localhost:3002/me", { withCredentials: true })
      .then((res)=>{
        setUser(res.data.user);
      })
      .catch((err)=>{
        console.log("Error fetching user:", err);
        if (err.response?.status === 401) {
          window.location.href = "http://localhost:3000/signup";
        }
        setError("Failed to fetch user info");
      })
  }, [])

  // Fetch holdings data
  useEffect(()=>{
    if (!user) return; // Only fetch if user is authenticated
    
    axios.get("http://localhost:3002/allHoldings", { withCredentials: true })
      .then((res)=>{
        const holdingsData = res.data;
        setHoldingsCount(holdingsData.length);
        setHoldings(holdingsData);

        // Calculate portfolio metrics
        let totalCurrentValue = 0;
        let totalInvestment = 0;

        holdingsData.forEach((holding) => {
          const currentValue = holding.qty * holding.price;
          const investment = holding.qty * holding.avg;
          
          totalCurrentValue += currentValue;
          totalInvestment += investment;
        });

        const pnl = totalCurrentValue - totalInvestment;
        const pnlPercent = totalInvestment > 0 ? ((pnl / totalInvestment) * 100).toFixed(2) : 0;

        setPortfolio({
          currentValue: totalCurrentValue,
          investment: totalInvestment,
          pnl: pnl,
          pnlPercent: pnlPercent,
        });
      })
      .catch((err)=>{
        console.log("Error fetching holding:", err);
        if (err.response?.status === 401) {
          window.location.href = "http://localhost:3000/signup";
        }
        setError("Failed to fetch holdings");
      })
  }, [user])

  // Fetch funds data
  useEffect(()=>{
    if (!user) return; // Only fetch if user is authenticated
    
    axios.get("http://localhost:3002/funds", { withCredentials: true })
      .then((res)=>{
        setMarginAvailable(res.data.availableFunds);
      })
      .catch((err)=>{
        console.log("Error fetching funds:", err);
        if (err.response?.status === 401) {
          window.location.href = "http://localhost:3000/signup";
        }
        setError("Failed to fetch funds");
      })
  }, [user])
  return (
    <>
      <div className="username">
        <h6>{user?.fullName || "User"}</h6>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Equity</p>
        </span>

        <div className="data">
          <div className="first">
            <h3>₹{marginAvailable.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</h3>
            <p>Margin Available</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Margins used <span>₹{marginsUsed.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>{" "}
            </p>
            <p>
              Opening balance <span>₹{(marginAvailable + marginsUsed).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>{" "}
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Holdings({holdingsCount})</p>
        </span>

        <div className="data">
          <div className="first">
            <h3 className={portfolio.pnl >= 0 ? "profit" : "loss"}>
              ₹{Math.abs(portfolio.pnl).toLocaleString('en-IN', { maximumFractionDigits: 2 })} <small>{portfolio.pnl >= 0 ? '+' : ''}{portfolio.pnlPercent}%</small>{" "}
            </h3>
            <p>P&L</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Current Value <span>₹{portfolio.currentValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>{" "}
            </p>
            <p>
              Investment <span>₹{portfolio.investment.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>{" "}
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>
    </>
  );
};

export default Summary;
