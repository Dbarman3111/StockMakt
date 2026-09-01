import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./Signup.css";
import Hero from "./Hero";
import OpenAccount from "../OpenAccount";

const investmentOptions = [
  { image: "media/images/aco.svg", title: "Stocks", text: "Invest in all exchange-listed securities" },
  { image: "media/images/step.svg", title: "Mutual funds", text: "Invest in commission-free direct mutual funds" },
  { image: "media/images/account_open.svg", title: "IPO", text: "Apply to the latest IPOs instantly via UPI" },
  { image: "media/images/aco.svg", title: "Futures & options", text: "Hedge and mitigate market risk through simplified F&O trading" },
];

const accountTypes = [
  { icon: "◎", title: "Individual Account", text: "Invest in equity, mutual funds and derivatives" },
  { icon: "♧", title: "HUF Account", text: "Make tax-efficient investments for your family" },
  { icon: "◎", title: "NRI Account", text: "Invest in equity, mutual funds, debentures, and more" },
  { icon: "◉", title: "Minor Account", text: "Teach your little ones about money & invest for their future with them" },
  { icon: "▥", title: "Corporate / LLP / Partnership", text: "Manage your business surplus and investments easily" },
];


function Signup() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [formData, setFormData] = useState({ fullName: "", email: "", phone: "", password: "" });
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(searchParams.get("create") === "1");

  useEffect(() => {
    setIsSignupOpen(searchParams.get("create") === "1");
  }, [searchParams]);

  const closeSignup = () => {
    setIsSignupOpen(false);
    setSearchParams({});
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleLoginChange = (event) => {
    setLoginData({ ...loginData, [event.target.name]: event.target.value });
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setStatus({ type: "", message: "" });
    setIsLoggingIn(true);

    try {
      const response = await fetch("https://stockmakt.onrender.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(loginData),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to login.");
      }

      window.location.href = "http://localhost:3001";
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: "", message: "" });
    setIsSubmitting(true);

    try {
      const response = await fetch("https://stockmakt.onrender.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to create account.");
      }

      window.location.href = "http://localhost:3001";
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="signup-page">
      <Hero />

      <section className="signup-account-section">
        <div className="signup-layout">
          <section className="signup-welcome">
            <img src="media/images/account_open.svg" alt="Open a Zerodha account" />
            <p className="signup-eyebrow">OPEN AN ACCOUNT</p>
            <h2>Invest in your future</h2>
            <p className="signup-welcome-text">
              Join millions of investors with a simple, transparent and secure platform.
            </p>
          </section>

          <section className="signup-login-panel">
          <p className="signup-eyebrow">ZERODHA ACCOUNT</p>
          <p className="signup-login-intro">Enter your login credentials</p>

          <form className="signup-form" onSubmit={handleLogin}>
            <label>
              Email address
              <input type="email" name="email" value={loginData.email} onChange={handleLoginChange} required />
            </label>
            <label>
              Password
              <input type="password" name="password" value={loginData.password} onChange={handleLoginChange} required />
            </label>
            <button type="submit" disabled={isLoggingIn}>
              {isLoggingIn ? "Logging in..." : "Login"}
            </button>
          </form>

          {status.message && <p className={`signup-status ${status.type}`} role="alert">{status.message}</p>}
          <p className="signup-register-prompt">
            Not registered? <button type="button" onClick={() => { setStatus({ type: "", message: "" }); setIsSignupOpen(true); }}>Create your account</button>
          </p>
          </section>
        </div>

        {isSignupOpen && (
          <div className="signup-modal-backdrop" role="presentation" onClick={closeSignup}>
            <section className="signup-panel signup-modal" role="dialog" aria-modal="true" aria-labelledby="create-account-title" onClick={(event) => event.stopPropagation()}>
              <button className="signup-modal-close" type="button" aria-label="Close create account form" onClick={closeSignup}>×</button>
              <p className="signup-eyebrow">ZERODHA ACCOUNT</p>
              <h2 id="create-account-title">Create your account</h2>
              <p className="signup-intro">Start investing with a simple, secure account.</p>

              <form className="signup-form" onSubmit={handleSubmit}>
                <label>
                  Full name
                  <input name="fullName" value={formData.fullName} onChange={handleChange} required />
                </label>
                <label>
                  Email address
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </label>
                <label>
                  Phone number
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
                </label>
                <label>
                  Password
                  <input type="password" name="password" minLength="8" value={formData.password} onChange={handleChange} required />
                </label>
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating account..." : "Create account"}
                </button>
              </form>

              {status.message && <p className={`signup-status ${status.type}`} role="alert">{status.message}</p>}
            </section>
          </div>
        )}
      </section>

      <section className="signup-existing">
        <h2>Already have a demat account?</h2>
        <p>Move your holdings to Zerodha and we'll cover your transfer costs, up to ₹500, <a href="#learn-more">learn more.</a></p>
      </section>

      <section className="signup-options">
        <h2>Investment options with Zerodha demat account</h2>
        <div className="signup-options-grid">
          {investmentOptions.map((option) => (
            <article className="signup-option" key={option.title}>
              <img src={option.image} alt="" />
              <div>
                <h3>{option.title}</h3>
                <p>{option.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="signup-account-types">
        <h2>Explore different account types</h2>
        <div className="signup-account-grid">
          {accountTypes.map((accountType) => (
            <article className="signup-account-card" key={accountType.title}>
              <span className="signup-account-icon" aria-hidden="true">{accountType.icon}</span>
              <h3>{accountType.title}</h3>
              <p>{accountType.text}</p>
            </article>
          ))}
        </div>
      </section>

      <OpenAccount />
    </main>
  );
}

export default Signup;
