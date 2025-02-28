import { Image } from "@chakra-ui/image";
import React, { useEffect } from "react";
import { useCallback } from "react";
import { Select } from "@chakra-ui/react";
import { VscChromeClose } from "react-icons/vsc";
import {
  addToCart,
  removeFromCart,
  fetchCart,
} from "../../actions/cartActions";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Empty from "../../components/Empty";
import Trust from "../../components/Trustdetails/Trust"
import "./cartcss.css";

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  const taxPercentage = 5;
  const deliveryCharge = 30;
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const removeFromCartHandler = useCallback(
    (cartItemId) => {
      console.log("Removing cart item:", cartItemId);
      dispatch(removeFromCart(cartItemId)).then(() => {
        dispatch(fetchCart()); // Fetch the cart again after removal
      });
    },
    [dispatch]
  );

  const checkoutHandler = () => {
    navigate("/shipping");
  };

  return (
    <>
      <Helmet>
        <title>Cart</title>
      </Helmet>
      {cartItems.length === 0 ? (
        <Empty />
      ) : (
        <div className="cartfull">
          <div className="cart">
            <h1>Your Cart : {cartItems.length}</h1>
            <div className="productsoncart">
              {cartItems.map((item) => (
                <div key={item._id} className="productcart">
                  <div className="imagecart">
                    <Image objectFit="cover" src={item.product.images[0]} />
                  </div>
                  <div>
                    <Link to={`/product/${item.product._id}`}>
                      {console.log(
                        "Navigating to product with ID:",
                        item.product._id
                      )}
                      <h2 className="productname">{item.product.brandname}</h2>
                    </Link>
                    <h2 className="priceproduct">Rs. {item.product.price}</h2>
                    <h2 className="sandh">sold and shipped by FedEx</h2>
                  </div>
                  <div className="qtyoption">
                    <Select
                      defaultValue={item.qty}
                      onChange={(e) =>
                        dispatch(
                          addToCart(item.product._id, Number(e.target.value))
                        )
                      }
                    >
                      {[...Array(item.product.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Select>
                    <h2>{(item.qty * item.product.price).toFixed(2)} Rs</h2>
                  </div>
                  <VscChromeClose
                    className="deletecart"
                    size="26"
                    onClick={() => removeFromCartHandler(item._id)}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="totalcart">
            <h3>
              Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}{" "}
              items) :
            </h3>
            <h3 className="totalprice">
              {cartItems
                .reduce((acc, item) => {
                  // Debugging logs to inspect each item
                  console.log("Item data for total price:", item);

                  // Ensure both product and price exist
                  if (item.product && item.product.price) {
                    return acc + item.qty * item.product.price;
                  }
                  return acc; // Skip items with missing data
                }, 0)
                .toFixed(2)}{" "}
              Rs
            </h3>
            <h3>Delivery :</h3>
            <h3 className="totalprice">{deliveryCharge} Rs</h3>
            <h3>Taxes :</h3>
            <h3 className="totalprice">{taxPercentage}% </h3>
            <h3>Total :</h3>
            <h3 className="totalprice">
              {(
                cartItems.reduce((acc, item) => {
                  if (item.product && item.product.price) {
                    return acc + item.qty * item.product.price;
                  }
                  return acc;
                }, 0) +
                deliveryCharge +
                (cartItems.reduce((acc, item) => {
                  if (item.product && item.product.price) {
                    return acc + item.qty * item.product.price;
                  }
                  return acc;
                }, 0) *
                  taxPercentage) /
                  100
              ).toFixed(2)}{" "}
              Rs
            </h3>
            <button
              className="checkoutbtn"
              disabled={cartItems.length === 0}
              onClick={checkoutHandler}
            >
              CHECKOUT
            </button>
          </div>
        </div>
      )}
      <Trust />
    </>
  );
};

export default CartPage;
