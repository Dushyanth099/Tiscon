import React from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Sweatpantsmen from "../../assets/Sweatpantsbannermen.png";
import Sweatpantswomen from "../../assets/Sweatpantsbannerwomen.png";
import CardProduct from "../CardProduct";
import "./Tshirts.css";
const SweatPants = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const gender = searchParams.get("gender") || "Men"; // Get gender from URL
  const banners = {
    Men: {
      img: Sweatpantsmen,
      title: "SweatPants",
      subtitle: "Enjoy your day",
    },
    Women: {
      img: Sweatpantswomen,
      title: "SweatPants",
      subtitle: "Stylish One",
    },
  };

  const productList = useSelector((state) => state.productList);
  const { products } = productList;

  const sweatpants = products
    .filter(
      (product) =>
        product.productdetails?.subcategory === "SweatPants" &&
        product.productdetails?.gender === gender
    )
    .slice(0, 5);

  return (
    <div className="category-container">
      <div className="banner">
        <img
          src={banners[gender].img}
          alt={`${gender} SweatPants`}
          className="banner-img"
        />
      </div>

      <div className="product-grid">
        {sweatpants.length > 0 ? (
          sweatpants.map((product) => (
            <CardProduct key={product._id} product={product} /> 
          ))
        ) : (
          <p className="no-products">No Sweatpants available.</p>
        )}
      </div>
    </div>
  );
};

export default SweatPants;
