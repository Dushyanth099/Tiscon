import React from "react";
import { FiFacebook } from "react-icons/fi";
import { AiOutlineInstagram } from "react-icons/ai";
import { IoLogoYoutube } from "react-icons/io";
import { Input, Stack } from "@chakra-ui/react";
import "./footercss.css";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <div className="footerCmp">
      <footer>
        <div className="footerCategorie">
          <h1>Categories</h1>
          <ul>
            <li>
              <Link to="/?gender=Women">Women</Link>
            </li>
            <li>
              <Link to="/?gender=Men">Men</Link>
            </li>
          </ul>
        </div>

        <div className="fooHelp">
          <h1>Help</h1>
          <ul>
            <li>Track Order</li>
            <li>Returns</li>
            <li>Shipping</li>
            <li>FAQs</li>
            <li>
              <Link to="/contactus">Contact us</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>
        </div>

        <div className="footerGetInTouch">
          <h1>Get in touch</h1>
          <ul>
            <p>
              Any questions? Let us know Reach us on Palette Production,Tiruppur
            </p>
            <li className="footerIcons">
              <FiFacebook size="25" />
            </li>
            <li className="footerIcons">
              <AiOutlineInstagram size="25" />
            </li>
            <li className="footerIcons">
              <IoLogoYoutube size="25" />
            </li>
          </ul>
        </div>

        <div className="footerNews">
          <h1>Newsletter</h1>
          <ul>
            <li>
              <Stack spacing={3}>
                <Input
                  variant="flushed"
                  placeholder="email@example.com"
                  size="10"
                  width="200px"
                />
              </Stack>
            </li>
            <li>
              <button className="footerBtn">Subscribe</button>
            </li>
          </ul>
        </div>

        <div className="creditsIcons">
          <ul>
            <li>
              <img
                src="https://i.imgur.com/AHCoUZO.png"
                className="img1"
                alt=""
              />
            </li>
            <li>
              <img
                src="https://i.imgur.com/JZRipBg.png"
                className="img2"
                alt=""
              />
            </li>
            <li>
              <img
                src="https://i.imgur.com/l8OAGyo.png"
                className="img3"
                alt=""
              />
            </li>
            <li>
              <img
                src="https://i.imgur.com/IDHC2iv.png"
                className="img4"
                alt=""
              />
            </li>
          </ul>
        </div>

        <div className="paragraphFooter">
          <p>
            Copyright ©2021 All rights reserved | This template is made with ♡
            by Developers of Palette Productions
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
