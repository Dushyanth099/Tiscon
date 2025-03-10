import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Cardscg = ({ title, imageSrc, cardStyle }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const genderParam = searchParams.get("gender");
  const [selected, setSelected] = useState(null);

  let linkPath = "";
  if (title === "Women") {
    linkPath = "/?gender=Women";
  } else if (title === "Men") {
    linkPath = "/?gender=Men";
  } else {
    linkPath = "/?category=Accessories";
  }

  useEffect(() => {
    if (genderParam === "Women" && title === "Women") {
      setSelected("Women");
    } else if (genderParam === "Men" && title === "Men") {
      setSelected("Men");
    } else {
      setSelected(null);
    }
  }, [genderParam, title]);

  return (
    <div
      className={`card ${cardStyle}`}
      style={{
        background:
          selected === "Women"
            ? "linear-gradient(90deg, #4b3849, #ea04a1)"
            : selected === "Men"
            ? "linear-gradient(90deg, #003366, #0055aa)"
            : "#000",
        border: selected === null ? "1px solid #888" : "none",
      }}
    >
      <Link to={linkPath}>
        <img src={imageSrc} alt={title} className="card-image" />
      </Link>
      <Link to={linkPath}>
        <h3 className="card-title">{title}</h3>
      </Link>
    </div>
  );
};

export default Cardscg;
