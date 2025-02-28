import React from "react";
import "./Pants.css";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Menpantbanner from "../../assets/Denimsmenbanner.png";
import Womenenpantbanner from "../../assets/Denimswomenbanner.png";
import CardProduct from "../CardProduct";

const Pants = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const gender = searchParams.get("gender") || "Men"; // Get gender from URL
  const banners = {
    Men: {
      img: Menpantbanner,
      title: "Pants",
      subtitle: "Style your way",
    },
    Women: {
      img: Womenenpantbanner,
      title: "Denim",
      subtitle: "Super Comfort",
    },
  };

  // Get product list from Redux state (Assuming product list is stored in Redux)
  const productList = useSelector((state) => state.productList);
  const { products } = productList;

  // Filter only T-Shirts from the product list (Show only 4)
  const denim = products
    .filter(
      (product) =>
        product.productdetails?.subcategory === "Jeans" &&
        product.productdetails?.gender === gender
    )
    .slice(0, 5);

  return (
    <div className="cat-container">
      {/* 📌 Banner Section */}
      <div className="banner">
        <img
          src={banners[gender].img}
          alt={`${gender} Jeans`}
          className="banner-img"
        />
      </div>

      {/* 📌 Product List */}
      <div className="product-grid">
        {denim.length > 0 ? (
          denim.map((product) => (
            <CardProduct key={product._id} product={product} /> // ✅ Using CardProduct
          ))
        ) : (
          <p className="no-products">No Denims available.</p>
        )}
      </div>
    </div>
  );
};

export default Pants;
