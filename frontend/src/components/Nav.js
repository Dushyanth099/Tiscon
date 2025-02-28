import React, { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLocation, Link, NavLink } from "react-router-dom";
import {
  Button,
  Input,
  InputGroup,
  useDisclosure,
  InputRightElement,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import { RiShoppingCart2Line } from "react-icons/ri";
import { MdSearch, MdHome } from "react-icons/md";
import { BsArrowRightShort } from "react-icons/bs";
import { MdKeyboardArrowRight } from "react-icons/md";
import { IoLogOutOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { logout } from "../actions/userActions";
import Logo from "../assets/ecommerce-logo.png";
import Categorylist from "./Categorylist/Categorylist";
import Brandlist from "./Brandlist/Brandlist";
import BrandImg from "../../src/assets/brandimg.svg";
import CategoryImg from "../../src/assets/categoryimg.svg";
import "./Nav.css";

const Nav = () => {
  const cancelRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const [incart, setincart] = useState(0);
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  const [nav, setNav] = useState(false);
  const searchRef = useRef(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const gender = searchParams.get("gender") || "Men";
  const [searchKeyword, setSearchKeyword] = useState("");
  const [signin, setSignin] = useState(null);
  const onSearchSubmit = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/products?keyword=${searchKeyword.trim()}&gender=${gender}`);
    }
    setSearchKeyword("");
  };
  const onSearchChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  useEffect(() => {
    const cart = cartItems.length ? cartItems.length : 0;
    setincart(cart);
    return () => {
      setincart(0);
    };
  }, [cart]);

  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  console.log("User Info:", userInfo);

  const logoutHandler = () => {
    dispatch(logout());
    onClose();
  };

  return (
    <nav className={`nav ${nav ? "active" : ""}`}>
      <NavLink to="/" className="logo">
        <img src={Logo} alt="logo" />
        <span className="logo-text">E-Commerce</span>
      </NavLink>

      <div className="search-container">
        <form onSubmit={onSearchSubmit}>
          <InputGroup>
            <Input
              type="text"
              placeholder="Search products,brands and more..."
              value={searchKeyword}
              onChange={onSearchChange}
              ref={searchRef}
              color="white"
            />
            <InputRightElement>
              <Button className="search-button" type="submit" size="sm">
                <MdSearch size="20" />
              </Button>
            </InputRightElement>
          </InputGroup>
        </form>
      </div>

      <ul className="navLinks">
        <li>
          <NavLink to="/" activeClassName="activlink" className="nav-item">
            <div className="nav-content">
              <MdHome size="20" className="nav-icon" />
              <span>Home</span>
            </div>
          </NavLink>
        </li>

        <li className="dropdown nav-item">
          <div className="nav-content">
            <img src={CategoryImg} alt="Categories" className="nav-img" />
            <span>Categories</span>
          </div>
          <Categorylist />
        </li>

        <li className="dropdown nav-item">
          <div className="nav-content">
            <img src={BrandImg} alt="Brands" className="nav-img" />
            <span className="dropdown-toggle">Brands</span>
          </div>
          <div className="dropdown-menu">
            <Brandlist />
          </div>
        </li>
        {/* Added Bag option in the list */}
        <li>
          <NavLink to="/cart" activeClassName="activlink" className="nav-item">
            <div className="nav-content">
              <RiShoppingCart2Line className="nav-icon" size="20" />
              <span>Bag</span>
              {userInfo && !userInfo.isAdmin && incart > 0 && (
                <div className="dotcart">{incart}</div>
              )}
            </div>
          </NavLink>
        </li>
      </ul>

      <div className="rightComp">
        {userInfo ? (
          <div className="ic_sett_dis">
            <Link to="/profile" className="user-profile">
              {userInfo.profilePicture ? (
                <img
                  src={
                    userInfo.profilePicture.startsWith("http")
                      ? userInfo.profilePicture
                      : `http://localhost:5000${userInfo.profilePicture}` // Update with your server URL
                  }
                  alt="Profile"
                  className="profile-img"
                  onError={(e) => (e.target.style.display = "none")} // Hide image if broken
                />
              ) : (
                <CgProfile size="25" className="settingIcon" />
              )}
              <span className="user-name">{userInfo.name}</span>{" "}
              {/* Show User Name */}
            </Link>
            <IoLogOutOutline
              size="28"
              className="displayIcon"
              onClick={onOpen}
            />
          </div>
        ) : (
          <Link to="/login">
            <div
              className="signin"
              onMouseOver={() => setSignin(!signin)}
              onMouseOut={() => setSignin(!signin)}
            >
              Sign in
              {!signin ? (
                <BsArrowRightShort size="25" />
              ) : (
                <MdKeyboardArrowRight size="25" />
              )}
            </div>
          </Link>
        )}
      </div>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent
            borderRadius="12px"
            boxShadow="lg"
            bg="white"
            maxW="320px"
            height={80}
            p={6} /* ⬅️ Added padding */
            animation="fadeIn 0.3s ease-in-out"
          >
            <AlertDialogHeader
              fontSize="md"
              fontWeight="bold"
              textAlign="center"
              p={4}
            >
              🚀 Logout Confirmation
            </AlertDialogHeader>

            <AlertDialogBody textAlign="center" fontSize="md" p={5}>
              Are you sure you want to log out? <br />
            </AlertDialogBody>

            <AlertDialogFooter display="flex" justifyContent="center" p={4}>
              <Button
                ref={cancelRef}
                onClick={onClose}
                borderRadius="8px"
                bg="gray.300"
                color="black"
                px={6}
                _hover={{ bg: "gray.400" }}
              >
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={logoutHandler}
                ml={3}
                px={6}
                borderRadius="8px"
                _hover={{ bg: "red.600" }}
              >
                Logout
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </nav>
  );
};

export default Nav;
