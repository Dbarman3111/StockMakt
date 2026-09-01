import React from "react";

function LeftSection({
  imageUrl,
  productName,
  productDescription,
  tryDemo,
  learnMore,
  googlePlay,
  appStore,
}) {
  return (
    <div className="container mt-5">
    <div className="row">
      <div className="col-6 p-3">
        <img src={imageUrl} />
      </div>
      <div className="col-6 p-5 mt-5">
          <h1>{productName}</h1>
          <p>{productDescription}</p>
           <div className="mt-4 p-3">
            <a href={tryDemo} style={{textDecoration:"none"}}>Try Demo <i class="fa fa-long-arrow-right" aria-hidden="true"></i></a>
          <a href={learnMore} style={{marginLeft:"50px", textDecoration: "none"}}>Learn More<i class="fa fa-long-arrow-right" aria-hidden="true"></i></a>
           </div>
           <div>
          <a href={googlePlay}><img src="media/images/google-play-badge.svg" /></a>
          <a href={appStore}><img src="media/images/appstore-badge.svg" style={{marginLeft:"50px"}} /></a>
           </div>
           
 
      </div>

    </div>
    </div>
  );
}

export default LeftSection;
