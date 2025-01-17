import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  productListReducer,
  productDetailsReducer,
  productDeleteReducer,
  productCreateReducer,
  productBulkUploadReducer,
  productUpdateReducer,
  productreviewCreateReducer,
} from "./reducers/productReducers";

import { cartReducer } from "./reducers/cartReducers";
import {
  CreateOrderReducers,
  OrderDeliverreducer,
  OrderDetailsreducer,
  OrderListMyreducer,
  OrderListreducer,
  OrderPayreducer,
  deliveryOrdersReducer,
  orderAcceptReducer,
  orderRejectReducer,
  orderCompleteReducer,
  orderReturnReducer,
  orderAssignReducer,
  invoiceReducer,
} from "./reducers/orderReducers";

import {
  userLoginReducer,
  userRegisterReducer,
  userDetailsReducer,
  userUpdateProfileReducer,
  userListReducer,
  userDeleteReducer,
  userUpdateReducer,
} from "./reducers/userReducers";

import {
  salesReducer,
  revenueReducer,
  ordersReducer,
} from "./reducers/dashboardReducers";

import {
  bannerAddReducer,
  bannerListReducer,
  bannerDeleteReducer,
} from "./reducers/bannerReducers";

const reducer = combineReducers({
  productList: productListReducer,
  productDetails: productDetailsReducer,
  productDelete: productDeleteReducer,
  productCreate: productCreateReducer,
  productBulkUpload: productBulkUploadReducer,
  productUpdate: productUpdateReducer,
  productReviewCreate: productreviewCreateReducer,
  cart: cartReducer,
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
  userList: userListReducer,
  userDelete: userDeleteReducer,
  userUpdate: userUpdateReducer,
  orderCreate: CreateOrderReducers,
  orderDetails: OrderDetailsreducer,
  orderPay: OrderPayreducer,
  orderMylist: OrderListMyreducer,
  orderList: OrderListreducer,
  orderDeliver: OrderDeliverreducer,
  deliveryOrders: deliveryOrdersReducer,
  orderAccept: orderAcceptReducer,
  orderReject: orderRejectReducer,
  orderComplete: orderCompleteReducer,
  orderReturn: orderReturnReducer,
  orderAssign: orderAssignReducer,
  sales: salesReducer,
  revenue: revenueReducer,
  orders: ordersReducer,
  invoiceDetails: invoiceReducer,
  bannerAdd: bannerAddReducer,
  bannerList: bannerListReducer,
  bannerDelete: bannerDeleteReducer,
});
const cartItemsFromStorage = localStorage.getItem("cartItems")
  ? JSON.parse(localStorage.getItem("cartItems"))
  : [];
const shippingAddressFromStorage = localStorage.getItem("shippingAddress")
  ? JSON.parse(localStorage.getItem("shippingAddress"))
  : {};
const userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const initialState = {
  cart: {
    cartItems: cartItemsFromStorage,
    shippingAddress: shippingAddressFromStorage,
  },
  userLogin: { userInfo: userInfoFromStorage },
};

const middelware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middelware))
);

export default store;
