import React from "react";
import "./OffersPage.css";
import { useNavigate } from "react-router-dom";
import Offerimg1 from "../../assets/Offerimg.png";
import Offerimg2 from "../../assets/Offerimg2.png";
import Offerimg3 from "../../assets/Offerimg3.png";
import Offerimg4 from "../../assets/Offerimg4.png";
import womenOfferimg1 from "../../assets/offerwomenimg1.png";
import womenOfferimg2 from "../../assets/offerwomenimg2.png";
import womenOfferimg3 from "../../assets/offerwomenimg3.png";
import womenOfferimg4 from "../../assets/offerwomenimg4.png";

const OffersPage = ({ category }) => {
  const navigate = useNavigate();
  const mencategories = [
    { imgSrc: Offerimg1, offerfilter: "under499" },
    { imgSrc: Offerimg2, offerfilter: "under1499" },
    { imgSrc: Offerimg3, offerfilter: "upto50" },
    { imgSrc: Offerimg4, offerfilter: "upto70" },
  ];
  const womencategories = [
    { imgSrc: womenOfferimg1, offerfilter: "under499" },
    { imgSrc: womenOfferimg2, offerfilter: "under1499" },
    { imgSrc: womenOfferimg3, offerfilter: "upto50" },
    { imgSrc: womenOfferimg4, offerfilter: "upto70" },
  ];
  const selectedCategories =
    category === "Men" ? mencategories : womencategories;
  const handleCardClick = (offerfilter) => {
    navigate(`/products?offerfilter=${offerfilter}&gender=${category}`);

  };

  return (
    <div className="offers">
      <h2>Offers</h2>
      <div className="offers-grid">
        {selectedCategories.map((offer, index) => (
          <div
            className="offerscard"
            key={index}
            onClick={() => handleCardClick(offer.offerfilter)}
          >
            <div className="offersimage">
              <img src={offer.imgSrc} alt={offer.name} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OffersPage;
