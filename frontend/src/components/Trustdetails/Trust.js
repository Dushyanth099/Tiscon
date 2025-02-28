import React from "react";
import "./Trust.css";
import { FaLock, FaCheck, FaUndoAlt, FaHeart } from "react-icons/fa";

const Trust = () => {
  return (
    <div className="Trust-details">
      <div className="trust-item">
        <FaLock className="trust-icon" />
        <span>Secure Payments</span>
      </div>
      <div className="trust-item">
        <FaCheck className="trust-icon" />
        <span>Genuine Products</span>
      </div>
      <div className="trust-item">
        <FaUndoAlt className="trust-icon" />
        <span>Try and Buy</span>
      </div>
      <div className="trust-item">
        <FaHeart className="trust-icon" />
        <span>Show Some Love</span>
      </div>
    </div>
  );
};

export default Trust;
