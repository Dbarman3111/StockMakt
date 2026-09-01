import React from "react";
import { Link } from "react-router-dom";

function Universe() {
  return (
    <div className="container mt-5 ">
      <div className="row text-center mt-5">
        <h1 className="text-muted">The Zerodha Universe</h1>
        <p className="text-muted text-center">
          Extend your trading and investment experience even further with our
          partner platforms
        </p>

        <div className="col-12 col-md-4 mt-5 p-3">
          <img className="universe-logo" src="media/images/z.png" alt="Zerodha Fund House" />
          <p className="text-small text-muted">
            Our asset management venture that is creating simple and transparent
            index funds to help you save for your goals.
          </p>
        </div>
        <div className="col-12 col-md-4 p-3">
          <img className="universe-logo" src="media/images/seg.svg" alt="Sensibull" />
          <p className="text-small text-muted">
            Options trading platform that lets you create strategies, analyze
            positions, and examine data points like open interest, FII/DII, and
            more.
          </p>
        </div>
        <div className="col-12 col-md-4 p-3">
          <img className="universe-logo" src="media/images/str.png" alt="Streak" />
          <p className="text-small text-muted">
            Systematic trading platform that allows you to create and backtest
            strategies without coding.
          </p>
        </div>
        <div className="col-12 col-md-4 p-3">
          <img className="universe-logo" src="media/images/sma.png" alt="Smallcase" />
          <p className="text-small text-muted">
            Thematic investing platform that helps you invest in diversified
            baskets of stocks on ETFs
          </p>
        </div>
        <div className="col-12 col-md-4 p-3">
          <img className="universe-logo" src="media/images/tij.svg" alt="Tijori Finance" />
          <p className="text-small text-muted">
            A modern research platform that helps you discover and understand
            businesses through detailed market data and insights.
          </p>
        </div>
        <div className="col-12 col-md-4 p-3">
          <img className="universe-logo" src="media/images/dit.png" alt="Ditto Insurance" />
          <p className="text-small text-muted">
            Personalized advice on life and health insurance. No spam and no
            mis-selling.
          </p>
        </div>
               <Link className='p-2 btn btn-primary fs-5' style={{width:"25%", margin: "0 auto"}} to="/signup?create=1">Sign up for free</Link>
      </div>
    </div>
  );
}

export default Universe;
