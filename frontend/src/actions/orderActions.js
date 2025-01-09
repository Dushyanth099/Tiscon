import axios from "axios";
import {
  ORDER_CREATE_FAIL,
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_DELIVER_FAIL,
  ORDER_DELIVER_REQUEST,
  ORDER_DELIVER_SUCCESS,
  ORDER_DETAILS_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_LIST_FAIL,
  ORDER_LIST_MY_FAIL,
  ORDER_LIST_MY_REQUEST,
  ORDER_LIST_MY_SUCCESS,
  ORDER_LIST_REQUEST,
  ORDER_LIST_SUCCESS,
  ORDER_PAY_FAIL,
  ORDER_PAY_REQUEST,
  ORDER_PAY_SUCCESS,
} from "../constants/orderConstants";
import {
  ORDER_DELIVERY_LIST_REQUEST,
  ORDER_DELIVERY_LIST_SUCCESS,
  ORDER_DELIVERY_LIST_FAIL,
  ORDER_ACCEPT_REQUEST,
  ORDER_ACCEPT_SUCCESS,
  ORDER_ACCEPT_FAIL,
  ORDER_REJECT_REQUEST,
  ORDER_REJECT_SUCCESS,
  ORDER_REJECT_FAIL,
  ORDER_COMPLETE_REQUEST,
  ORDER_COMPLETE_SUCCESS,
  ORDER_COMPLETE_FAIL,
  ORDER_RETURN_REQUEST,
  ORDER_RETURN_SUCCESS,
  ORDER_RETURN_FAIL,
  ORDER_ASSIGN_REQUEST,
  ORDER_ASSIGN_SUCCESS,
  ORDER_ASSIGN_FAIL,
} from "../constants/orderConstants";

export const CreateOrder = (order) => async (dispatch, getState) => {
  try {
    dispatch({
      type: ORDER_CREATE_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post(`/api/orders`, order, config);
    dispatch({
      type: ORDER_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ORDER_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
export const getOrderDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: ORDER_DETAILS_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/orders/${id}`, config);
    dispatch({
      type: ORDER_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ORDER_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
export const payOrder =
  (orderId, paymentResult) => async (dispatch, getState) => {
    try {
      dispatch({
        type: ORDER_PAY_REQUEST,
      });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.put(
        `/api/orders/${orderId}/pay`,
        paymentResult,
        config
      );
      dispatch({
        type: ORDER_PAY_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: ORDER_PAY_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const deliverOrder = (order) => async (dispatch, getState) => {
  try {
    dispatch({
      type: ORDER_DELIVER_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.put(
      `/api/orders/${order._id}/deliver`,
      {},
      config
    );
    dispatch({
      type: ORDER_DELIVER_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ORDER_DELIVER_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listMyOrders = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: ORDER_LIST_MY_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/orders/myorders`, config);
    dispatch({
      type: ORDER_LIST_MY_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ORDER_LIST_MY_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listOrders = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: ORDER_LIST_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/orders/`, config);
    dispatch({
      type: ORDER_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ORDER_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// delivery
// Fetch orders for delivery person
export const listOrdersForDelivery = () => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_DELIVERY_LIST_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    };

    const { data } = await axios.get("/api/orders/delivery", config);

    dispatch({ type: ORDER_DELIVERY_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ORDER_DELIVERY_LIST_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Accept an order
export const acceptOrder = (orderId) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_ACCEPT_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    };

    await axios.put(`/api/orders/delivery/accept/${orderId}`, {}, config);

    dispatch({ type: ORDER_ACCEPT_SUCCESS });
  } catch (error) {
    dispatch({
      type: ORDER_ACCEPT_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Reject an order
export const rejectOrder = (orderId) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_REJECT_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    };

    await axios.put(`/api/orders/delivery/reject/${orderId}`, {}, config);

    dispatch({ type: ORDER_REJECT_SUCCESS });
  } catch (error) {
    dispatch({
      type: ORDER_REJECT_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Mark order as completed
export const completeOrder = (orderId) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_COMPLETE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    };

    await axios.put(`/api/orders/delivery/complete/${orderId}`, {}, config);

    dispatch({ type: ORDER_COMPLETE_SUCCESS });
  } catch (error) {
    dispatch({
      type: ORDER_COMPLETE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Mark order as returned
export const returnOrder = (orderId, reason) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_RETURN_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    };

    await axios.put(
      `/api/orders/delivery/return/${orderId}`,
      { returnReason: reason },
      config
    );

    dispatch({ type: ORDER_RETURN_SUCCESS });
  } catch (error) {
    dispatch({
      type: ORDER_RETURN_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};
// Assign an order to a delivery person
export const assignOrder =
  (orderId, deliveryPersonId) => async (dispatch, getState) => {
    try {
      dispatch({ type: ORDER_ASSIGN_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.put(
        `/api/orders/admin/orders/assign/${orderId}`,
        { deliveryPersonId },
        config
      );

      dispatch({ type: ORDER_ASSIGN_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: ORDER_ASSIGN_FAIL,
        payload: error.response?.data?.message || error.message,
      });
    }
  };
