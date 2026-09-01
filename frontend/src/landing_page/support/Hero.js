import React, { useState } from "react";

function Hero() {
  const [query, setQuery] = useState("");

  return (
    <header className="support-hero">
      <div className="support-hero-content">
        <div className="support-title-row">
          <h1>Support Portal</h1>
          <button className="support-tickets-button" type="button">
            My tickets
          </button>
        </div>
        <label className="support-search">
          <i className="fa fa-search" aria-hidden="true"></i>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Eg: How do I open my account, How do I activate F&O..."
            aria-label="Search support articles"
          />
        </label>
      </div>
    </header>
  );
}

export default Hero;