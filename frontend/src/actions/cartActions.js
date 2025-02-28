import axios from "axios";
import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_SHIPPING_ADRESSE,
  CART_SAVE_PAYMENT,
  CART_FETCH_ITEMS,
  SAVE_SHIPPING_COST,
  SAVE_SHIPPING_RATES,
} from "../constants/cartConstants";

export const addToCart = (id, qty) => async (dispatch, getState) => {
  const {
    userLogin: { userInfo },
  } = getState();
  const { data } = await axios.post(
    `/api/products/${id}/addtocart`,
    { id, qty },
    {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }
  );
  console.log("Cart Items data", data);
  dispatch({
    type: CART_ADD_ITEM,
    payload: data.cartItems,
  });
};

export const fetchCart = () => async (dispatch, getState) => {
  try {
    const {
      userLogin: { userInfo },
    } = getState();

    const { data } = await axios.get("/api/users/cart", {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    });

    dispatch({
      type: CART_FETCH_ITEMS,
      payload: data.cartItems,
    });
  } catch (error) {
    console.error("Error fetching cart items:", error.message);
  }
};
export const removeFromCart = (cartItemId) => async (dispatch, getState) => {
  try {
    const {
      userLogin: { userInfo },
    } = getState();
    console.log("Deleting cart item ID:", cartItemId); // Debugging log
    const { data } = await axios.delete(
      `/api/products/${cartItemId}/deletecart`,
      {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
    );
    dispatch({
      type: CART_REMOVE_ITEM,
      payload: cartItemId,
    });
    console.log("Cart updated after removal:", data);
  } catch (error) {
    console.error("Error removing item from cart:", error);
  }
};

export const saveAddressshipping = (data) => (dispatch, getState) => {
  dispatch({
    type: CART_SAVE_SHIPPING_ADRESSE,
    payload: data,
  });
};
export const savepaymentmethod = (data) => (dispatch, getState) => {
  dispatch({
    type: CART_SAVE_PAYMENT,
    payload: data,
  });
};

export const saveShippingCost = (shippingCost) => ({
  type: "SAVE_SHIPPING_COST",
  payload: shippingCost,
});

export const saveShippingRates = (shippingRates) => ({
  type: "SAVE_SHIPPING_RATES",
  payload: shippingRates,
});
