import { React, useState, useEffect } from "react";
import { HiOutlineShoppingCart, HiShoppingCart } from "react-icons/hi";
import { Image, useToast } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import Rating from "./Rating";
import { addToCart } from "../actions/cartActions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CardProduct = ({ product }) => {
  const toast = useToast();
  const navigate = useNavigate();
  const [showbtn, setShowbtn] = useState(false);
  const [Incart, setIncart] = useState(false);
  const dispatch = useDispatch();
  const Cart = useSelector((state) => state.cart);
  const { cartItems } = Cart;
  const userLogin = useSelector((state) => state.userLogin);
  const userInfo = userLogin?.userInfo;

  useEffect(() => {
    const isincart = cartItems.find((x) => x.product === product._id);
    if (isincart) {
      setIncart(true);
    }
  }, [cartItems, product._id]);

  const addcart = () => {
    if (!userInfo) {
      toast({
        title: "Login Required",
        description: "Please log in to add items to your cart.",
        status: "warning",
        duration: 4000,
        position: "top-right",
        isClosable: true,
      });
      navigate("/login");
      return;
    }
    toast({
      title: "Product added to cart.",
      description: `Click to view details.`,
      status: "success",
      duration: 5000,
      position: "bottom",
      isClosable: true,
    });
    setIncart(true);
    dispatch(addToCart(product._id, 1));
  };

  return (
    <div
      className="cardProduct"
      onMouseOver={() => setShowbtn(true)}
      onMouseLeave={() => setShowbtn(false)}
    >
      <div className="imgDiv" style={{ position: "relative" }}>
        {/* Discount Badge on Top-Left */}
        {product.discount > 0 && (
          <div
            className="discountBadge"
            style={{
              position: "absolute",
              backgroundColor: "black",
              color: "white",
              padding: "5px 10px",
              fontSize: "14px",
              fontWeight: "bold",
              borderRadius: "5px",
              zIndex: "10",
            }}
          >
            {product.discount}% OFF
          </div>
        )}

        <Image
          className="imgProduct"
          boxSize="350px"
          objectFit="cover"
          src={product.images[0]}
        />
      </div>
      <div className="bottomcard">
        <Link to={`/product/${product._id}`} exact>
          <span>{product.brandname}</span>
        </Link>

        {/* Shopping Cart Icon */}
        {Incart ? (
          <HiShoppingCart className="iconFav" size="26" />
        ) : (
          <HiOutlineShoppingCart
            className="iconFav"
            color="#999"
            size="26"
            onClick={addcart}
          />
        )}

        {/* Price Section with Discount & Old Price */}
        <div className="productpricecard">
          {product.oldPrice && product.oldPrice > product.price && (
            <span
              className="oldPrice"
              style={{
                textDecoration: "line-through",
                color: "#999",
                marginRight: "5px",
                fontSize: "14px",
              }}
            >
              Rs. {product.oldPrice}
            </span>
          )}
          <span
            className="newPrice"
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              color: "#000",
            }}
          >
            Rs. {product.price}
          </span>
        </div>

        {/* Rating Component */}
        <div className="Rating">
          <Rating
            value={product.rating}
            text={`${product.numReviews} reviews`}
          />
        </div>
      </div>

      {/* Quick View Button */}
      <Link to={`/product/${product._id}`} exact>
        <button className={showbtn ? "QuickView QuickViewActive" : "QuickView"}>
          View Details
        </button>
      </Link>
    </div>
  );
};

export default CardProduct;
