import React, { useState } from "react";

const categories = [
  { name: "Account Opening", icon: "fa-plus-circle",
    links: [
       "Resident individual",
       "Minor",
       "Non Resident India (NRI)",
       "Company, Partnership, HUF and LLP",
       "Glossary"
    ]
  },
  {name:"Your Zerodha Account", icon:"fa-user-circle-o",
    links: [
      "Your Profile",
      "Account modification",
      "Client Master Report (CMR) and Depository Participant (DP)",
      "Nomination",
      "Transfer and conversion of securities"

    ]
  },
  {name:"Kite", icon:"fa-compass",
    links: [
      "IPO",
      "Trading FAQs",
      "Margin Trading Facility (MTF) and Margins",
      "Charts and orders",
      "Alerts and Nudges",
      "General"
    ]
  },
  {name:"Funds", icon:"fa-inr",
    links : [
      "Add money",
      "Withdraw money",
      "Add bank account",
      "eMandates"
    ]
  },
  {name:"Console", icon:"fa-at",
    links : [
     " Portfolio",
      "Corporate actions",
      "Funds statement",
      "Reports",
      "Profile",
      "Segments"
    ]
  },
  {name:"Coin", icon:"fa-adjust",
    links : [
      "Mutual funds",
      "National Pension Scheme (NPS)",
      "Fixed Deposit (FD)",
      "Features on Coin",
      "Payments and Orders",
      "General"
    ]
  },
];

function CreateTicket() {
  const [openCategory, setOpenCategory] = useState(null);

  return (
    <main className="support-content container">
      <section className="support-categories" aria-label="Support categories">
        {categories.map(({ name, icon, links }, index) => (
          <div className="support-category" key={name}>
            <button
              className="support-category-button"
              type="button"
              onClick={() => setOpenCategory(openCategory === index ? null : index)}
              aria-expanded={openCategory === index}
            >
              <span className="support-category-icon">
                <i className={`fa ${icon}`} aria-hidden="true"></i>
              </span>
              <span>{name}</span>
              <i
                className={`fa fa-chevron-down support-chevron ${openCategory === index ? "is-open" : ""}`}
                aria-hidden="true"
              ></i>
            </button>
            {openCategory === index && (
              <div className="support-category-details">
                <ul>
                  {links.map((link) => (
                    <li key={link}>
                      <a href={`#${link.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        ))}
      </section>

      <aside className="support-sidebar">
        <div className="support-notice">
          <ul>
            <li><a href="#ofs">Offer for sale (OFS) - August 2026</a></li>
            <li><a href="#surveillance">Surveillance measure on scrips - August 2026</a></li>
          </ul>
        </div>
        <div className="support-links">
          <h2>Quick links</h2>
          <a href="#account-opening">1. Track account opening</a>
          <a href="#segment-activation">2. Track segment activation</a>
          <a href="#intraday-margins">3. Intraday margins</a>
          <a href="#kite-manual">4. Kite user manual</a>
          <a href="#create-ticket">5. Learn how to create a ticket</a>
        </div>
      </aside>
    </main>
  );
}

export default CreateTicket;