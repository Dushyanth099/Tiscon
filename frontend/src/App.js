import { Box } from "@chakra-ui/react";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import About from "./pages/About/About";
import Contactus from "./pages/Contactus/Contactus";
import Productpage from "./pages/Product/Productpage";
import Cartpage from "./pages/Cart/Cartpage";
import Footer from "./pages/Footer/Footer";
import LoginScreen from "./pages/Login/LoginScreen";
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import ScrollIntoView from "./components/Scrollintoview";
import RegisterScreen from "./components/RegisterScreen";
import ProfileScreen from "./components/ProfileScreen";
import Checkout from "./pages/checkout/Checkout";
import Placeorder from "./pages/placeorder/Placeorder";
import Order from "./pages/Order/Order";
import Users from "./pages/Userslist/Users";
import NotFoundPage from "./components/Notfoundpage";
import Edituser from "./pages/Useredit/Edituser";
import Products from "./pages/products/products";
import Editproduct from "./pages/Editproduct/Editproduct";
import Orders from "./pages/Orders/Orders";
import AssignOrderScreen from "./pages/Delivery/AssignOrderScreen";
import Dashboard from "./pages/Dashboard/Dashboard";
import { useSelector } from "react-redux";
import InvoiceScreen from "./pages/InvoiceScreen/InvoiceScreen";
import AdminLayout from "./pages/Admin/AdminLayout";
import AdminBannerScreen from "./pages/AdminBanner/AdminBannerScreen";
import CreateProductPage from "./pages/Editproduct/CreateProductPage";
import AdminVideoBanner from "./pages/AdminBanner/AdminVideoBanner";
import ProductsListPage from "./pages/ProductsListPage/ProductsListPage";
import { useNavigate } from "react-router-dom";
import BulkUploadPage from "./pages/Editproduct/BulkUpload";
import Overview from "./pages/products/productOverview";
import IncomeByCity from "./components/IncomeBycity/Incomebycity";
import TransactionTable from "./pages/Transactions/Transaction";

const App = () => {
  const { userInfo } = useSelector((state) => state.userLogin);

  return (
    <div className="main">
      <ChakraProvider>
        <Router>
          <ScrollIntoView>
            {userInfo && userInfo.isAdmin ? (
              <AdminLayout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/profile" element={<ProfileScreen />} />
                  <Route path="/admin/dashboard" element={<Dashboard />} />
                  <Route path="/admin/userlist" element={<Users />} />
                  <Route path="/admin/productlist" element={<Products />} />
                  <Route path="/product/:id" element={<Productpage />} />
                  <Route path="/admin/orderlist" element={<Orders />} />
                  <Route path="/order/:id" element={<Order />} />
                  <Route path="/admin/user/:id/edit" element={<Edituser />} />
                  <Route
                    path="/admin/incomebycity"
                    element={<IncomeByCity />}
                  />
                  <Route
                    path="/admin/product/create"
                    element={<CreateProductPage />}
                    exact
                  />
                  <Route
                    path="/admin/bulkupload"
                    element={<BulkUploadPage />}
                  />
                  <Route
                    path="/admin/product/:id/edit"
                    element={<Editproduct />}
                  />
                  <Route
                    path="/admin/assignorders"
                    element={<AssignOrderScreen />}
                    exact
                  />{" "}
                  <Route path="/products/" element={<ProductsListPage />} />
                  <Route path="/search/:keyword" element={<Home />} />
                  <Route path="/adminbanner" element={<AdminBannerScreen />} />
                  <Route
                    path="/adminvideobanner"
                    element={<AdminVideoBanner />}
                  />
                  <Route
                    path="/admin/order/:id/invoice"
                    element={<InvoiceScreen />}
                    exact
                  />
                  <Route
                    path="/products/:category"
                    element={<ProductsListPage />}
                  />
                  <Route path="/productsoverview" element={<Overview />} />
                  <Route path="/transactions" element={<TransactionTable />} />
                  <Route
                    path="*"
                    element={<Navigate to="/admin/orderlist" />}
                  />
                </Routes>{" "}
              </AdminLayout>
            ) : (
              <>
                <Nav />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contactus" element={<Contactus />} />
                  <Route path="/product/:id" element={<Productpage />} />
                  <Route path="/cart/:id?" element={<Cartpage />} />
                  <Route path="/login" element={<LoginScreen />} />
                  <Route path="/register" element={<RegisterScreen />} />
                  <Route path="/profile" element={<ProfileScreen />} />
                  <Route path="/shipping" element={<Checkout />} />
                  <Route path="/placeorder" element={<Placeorder />} />
                  <Route path="/order/:id" element={<Order />} />
                  <Route path="/search/:keyword" element={<Home />} />
                  <Route path="/products/" element={<ProductsListPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
                <Footer />
                {/* path="/products/:category" */}
              </>
            )}
          </ScrollIntoView>
        </Router>
      </ChakraProvider>
    </div>
  );
};
export default App;
