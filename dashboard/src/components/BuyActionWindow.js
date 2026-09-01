import React, { useContext, useState } from "react";

import axios from "axios";

import GeneralContext from "./GeneralContext";

import "./BuyActionWindow.css";

const BuyActionWindow = ({ uid, mode }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(1.0);
  const [orderError, setOrderError] = useState("");
  const generalContext = useContext(GeneralContext);

  const handleBuyClick = async () => {
    if (Number(stockQuantity) <= 0 || Number(stockPrice) <= 0) {
      setOrderError("Quantity and price must be greater than zero.");
      return;
    }

    setOrderError("");
    try {
      await axios.post("http://localhost:3002/newOrder", {
        name: uid,
        qty: Number(stockQuantity),
        price: Number(stockPrice),
        mode,
      }, { withCredentials: true });
      generalContext.closeBuyWindow();
    } catch (error) {
      setOrderError(
        error.response?.data?.message ||
        (error.request ? "Backend is not reachable. Start the backend on port 3002." : "Unable to place order.")
      );
    }
  };

  const handleCancelClick = () => {
    generalContext.closeBuyWindow();
  };

  return (
    <div className="container" id="buy-window" draggable="true">
      <div className="regular-order">
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              name="qty"
              id="qty"
              onChange={(e) => setStockQuantity(e.target.value)}
              value={stockQuantity}
            />
          </fieldset>
          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              name="price"
              id="price"
              step="0.05"
              onChange={(e) => setStockPrice(e.target.value)}
              value={stockPrice}
            />
          </fieldset>
        </div>
      </div>

      <div className="buttons">
        <span>Margin required ₹140.65</span>
        <div>
          <button type="button" className="btn btn-blue" onClick={handleBuyClick}>
            {mode === "SELL" ? "Sell" : "Buy"}
          </button>
          <button type="button" className="btn btn-grey" onClick={handleCancelClick}>
            Cancel
          </button>
        </div>
      </div>
      {orderError && <p className="order-error" role="alert">{orderError}</p>}
    </div>
  );
};

export default BuyActionWindow;
