import React, { useEffect, useState } from "react";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { listBanners } from "../actions/bannerActions";
import ShopNowBtn from "./ShopNowBtn";

const Slider = () => {
  const dispatch = useDispatch();
  const bannerList = useSelector((state) => state.bannerList);
  const { loading, error, banners } = bannerList;

  const [current, setCurrent] = useState(0);
  const length = banners?.length || 0;
  const [auto, setAuto] = useState(true);
  const intervalTime = 6000;
  let slideInterval;

  const nextSlide = () => {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, intervalTime);
    setCurrent(current === length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, intervalTime);
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  useEffect(() => {
    dispatch(listBanners());
  }, [dispatch]);

  useEffect(() => {
    setAuto(true);
    if (auto) {
      slideInterval = setInterval(nextSlide, intervalTime);
    }
    return () => {
      setAuto(false);
      clearInterval(slideInterval);
    };
  }, [auto, current]);

  return (
    <div className="slider">
      {banners.map((banner, index) => (
        <div
          key={banner._id}
          className={index === current ? "slide current" : "slide"}
          style={{
            background: `url(${banner.image}) no-repeat center top/cover`,
          }}
        >
          <h1 className="titleslider">{banner.title}</h1>
          <h3 className="subtitleslider">{banner.subtitle}</h3>
          <div className="content">
            <Link to="/shop">
              <ShopNowBtn />
            </Link>
          </div>
        </div>
      ))}
      <IoIosArrowForward className="next" size="32" onClick={nextSlide} />
      <IoIosArrowBack className="prev" size="32" onClick={prevSlide} />
    </div>
  );
};

export default Slider;
