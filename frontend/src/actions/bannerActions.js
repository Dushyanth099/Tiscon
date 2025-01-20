import axios from "axios";
import {
  BANNER_LIST_REQUEST,
  BANNER_LIST_SUCCESS,
  BANNER_LIST_FAIL,
  BANNER_ADD_REQUEST,
  BANNER_ADD_SUCCESS,
  BANNER_ADD_FAIL,
  BANNER_DELETE_REQUEST,
  BANNER_DELETE_SUCCESS,
  BANNER_DELETE_FAIL,
} from "../constants/bannerConstants";

// Fetch banners
export const listBanners = () => async (dispatch) => {
  try {
    dispatch({ type: BANNER_LIST_REQUEST });
    const { data } = await axios.get("/api/banners/banners");
    dispatch({ type: BANNER_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: BANNER_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Add banner
export const addBanner = (bannerData) => async (dispatch, getState) => {
  try {
    dispatch({ type: BANNER_ADD_REQUEST });

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
      "/api/banners/banner",
      bannerData,
      config
    );

    dispatch({ type: BANNER_ADD_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: BANNER_ADD_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Delete banner
export const deleteBanner = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: BANNER_DELETE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    await axios.delete(`/api/banners/banners/${id}`, config);

    dispatch({ type: BANNER_DELETE_SUCCESS });
  } catch (error) {
    dispatch({
      type: BANNER_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
