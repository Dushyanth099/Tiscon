import axios from "axios";
import {
  SHIPPING_RATES_REQUEST,
  SHIPPING_RATES_SUCCESS,
  SHIPPING_RATES_FAIL,
  SELECT_SHIPPING_RATE,
  CREATE_SHIPMENT_REQUEST,
  CREATE_SHIPMENT_SUCCESS,
  CREATE_SHIPMENT_FAIL,
} from "../constants/deliveryConstants";

export const fetchShippingRates =
  (userAddress, productId) => async (dispatch, getState) => {
    try {
      dispatch({ type: SHIPPING_RATES_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.post(
        "/api/delivery/shipmentrates",
        { userAddress, productId },
        config
      );
      dispatch({
        type: SHIPPING_RATES_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: SHIPPING_RATES_FAIL,
        payload: error.response?.data?.message || error.message,
      });
    }
  };
// Select a shipping rate action
export const selectShippingRate = (rate) => (dispatch) => {
  dispatch({
    type: SELECT_SHIPPING_RATE,
    payload: rate,
  });
};

export const createShipment =
  (order, productId) => async (dispatch, getState) => {
    console.log("✅ Received Order in Action:", order);
    console.log("✅ Received Product ID in Action:", productId);
 
    try {
      dispatch({ type: CREATE_SHIPMENT_REQUEST });

      // Get user token from Redux state
      const {
        userLogin: { userInfo },
      } = getState();

      // API request config with authorization header
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      // Send a request to backend to create a shipment
      const { data } = await axios.post(
        `/api/delivery/createShipment`,
        { order, productId },
        config
      );

      dispatch({
        type: CREATE_SHIPMENT_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: CREATE_SHIPMENT_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
