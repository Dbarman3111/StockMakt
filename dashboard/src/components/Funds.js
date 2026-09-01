import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Funds = () => {
  const [availableFunds, setAvailableFunds] = useState(0);
  const [fundsError, setFundsError] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3002/funds", { withCredentials: true })
      .then((response) => setAvailableFunds(response.data.availableFunds))
      .catch((error) => setFundsError(error.response?.data?.message || "Unable to load funds. Start the backend on port 3002."));
  }, []);

  const formattedFunds = availableFunds.toFixed(2);

  return (
    <>
      <div className="funds">
        {/* <p>Instant, zero-cost fund transfers with UPI </p> */}
        
        <Link className="btn btn-green ">Add funds</Link>
        <Link className="btn btn-blue">Withdraw</Link>
      </div>

      <div className="funds-equity">
        <div className="funds-heading">
          <p>Equity</p>
        </div>

        <div className="table">
          {fundsError && <p className="funds-error" role="alert">{fundsError}</p>}
            <div className="data">
              <p>Available margin</p>
              <p className="imp colored">{formattedFunds}</p>
            </div>
            <div className="data">
              <p>Used margin</p>
              <p className="imp">3,757.30</p>
            </div>
            <div className="data">
              <p>Available cash</p>
              <p className="imp">{formattedFunds}</p>
            </div>
            <hr />
            <div className="data">
              <p>Opening Balance</p>
              <p>{formattedFunds}</p>
            </div>
            <div className="data">
              <p>Opening Balance</p>
              <p>3736.40</p>
            </div>
            <div className="data">
              <p>Payin</p>
              <p>4064.00</p>
            </div>
            <div className="data">
              <p>SPAN</p>
              <p>0.00</p>
            </div>
            <div className="data">
              <p>Delivery margin</p>
              <p>0.00</p>
            </div>
            <div className="data">
              <p>Exposure</p>
              <p>0.00</p>
            </div>
            <div className="data">
              <p>Options premium</p>
              <p>0.00</p>
            </div>
            <hr />
            <div className="data">
              <p>Collateral (Liquid funds)</p>
              <p>0.00</p>
            </div>
            <div className="data">
              <p>Collateral (Equity)</p>
              <p>0.00</p>
            </div>
            <div className="data">
              <p>Total Collateral</p>
              <p>0.00</p>
            </div>
        </div>
      </div>

      <div className="commodity">
        <p>You don't have a commodity account</p>
        <Link className="btn btn-blue" to="/signup?create=1">Open Account</Link>
      </div>
    </>
  );
};

export default Funds;
