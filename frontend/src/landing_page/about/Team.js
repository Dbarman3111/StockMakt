import React from 'react'

function Team() {
  return (
      <div className="container">
      <div className="row p-3 mt-5  border-top">
        <h1 className="text-center text-muted">
          People
        </h1>
      </div>

      <div className="row p-3 mb-3  text-muted  ">
        <div className="col-6 p-2 text-center">
          <img  src = 'media/images/photo.D.png' style={{borderRadius:"100%", width: "300px"}}/> 
          <h4 className='mt-3 fs-4'>Dipankar Barman</h4>
          <h5 className='fs-6'>Founder, CEO </h5>
        </div>
        <div className="col-6 p-2">
          <p>
            Dipankar bootstrapped and founded Zerodha in 2026 to overcome the hurdles he faced during his decade long stint as a trader. Today, Zerodha has changed the landscape of the Indian broking industry.</p>

            <p>
               He is a member of the SEBI Secondary Market Advisory Committee (SMAC) and the Market Data Advisory Committee (MDAC).</p>

             <p> Playing basketball is his zen. </p>
             <p>Connect on <a href='' style={{textDecoration: "none"}}>Homepage </a> / <a href=''style={{textDecoration: "none"}}>TradingQnA </a> /<a href='' style={{textDecoration: "none"}}> Twitter </a></p>
          
        </div>
      </div>
    </div>
  )
}

export default Team