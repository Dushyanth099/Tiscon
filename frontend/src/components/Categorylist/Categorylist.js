import React from "react";
import { Link } from "react-router-dom";
import "../Nav.css";
const Categorylist = () => {
  return (
    <div className="category-contain">
      <div className="dropdown-menu">
        <div className="category-column">
          <ul>
            <li>
              <Link to="/products?gender=Men">Boys</Link>
            </li>
            <li>
              <Link to="/products?gender=Women">Girls</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Categorylist;
