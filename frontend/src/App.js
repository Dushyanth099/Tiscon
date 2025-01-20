import { Box } from "@chakra-ui/react";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import About from "./pages/About/About";
import Shop from "./pages/Shop";
import Contactus from "./pages/Contactus/Contactus";
import Productpage from "./pages/Product/Productpage";
import Cartpage from "./pages/Cart/Cartpage";
import Footer from "./pages/Footer/Footer";
import LoginScreen from "./pages/Login/LoginScreen";
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import ScrollIntoView from "./components/Scrollintoview";
import HashLoader from "react-spinners/HashLoader";
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
import DeliveryDashboard from "./pages/Delivery/DeliveryDashboard";
import Dashboard from "./pages/Dashboard/Dashboard";
import { useSelector } from "react-redux";
import InvoiceScreen from "./pages/InvoiceScreen/InvoiceScreen";
import DeliveryNavbar from "./pages/Delivery/DeliveryNavbar";
import DeliveryHomepage from "./pages/Delivery/DeliveryHomepage";
import AdminLayout from "./pages/Admin/AdminLayout";
import AdminBannerScreen from "./pages/AdminBanner/AdminBannerScreen";

const App = () => {
  const [loading, setLoading] = useState(false);
  const { userInfo } = useSelector((state) => state.userLogin);
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  return (
    <div className="main">
      <ChakraProvider>
        <Router>
          <ScrollIntoView>
            {loading ? (
              <div className="loading">
                <HashLoader color={"#1e1e2c"} loading={loading} size={40} />
              </div>
            ) : (
              <Switch>
                {userInfo && userInfo.isDelivery ? (
                  <>
                    <DeliveryNavbar />
                    <Box mt="60px">
                      <Route
                        path="/deliveryhomepage"
                        component={DeliveryHomepage}
                      />
                      <Route
                        path="/delivery-dashboard"
                        component={DeliveryDashboard}
                      />
                      <Redirect to="/deliveryhomepage" />
                      <Route path="/profile" component={ProfileScreen} />{" "}
                    </Box>
                  </>
                ) : userInfo && userInfo.isAdmin ? (
                  <AdminLayout>
                    <Switch>
                      <Route path="/profile" component={ProfileScreen} />
                      <Route path="/admin/dashboard" component={Dashboard} />
                      <Route path="/admin/userlist" component={Users} />
                      <Route path="/admin/productlist" component={Products} />
                      <Route path="/product/:id" component={Productpage} />
                      <Route path="/admin/orderlist" component={Orders} />
                      <Route path="/order/:id" component={Order} />
                      <Route path="/admin/user/:id/edit" component={Edituser} />
                      <Route
                        path="/admin/product/:id/edit"
                        component={Editproduct}
                      />
                      <Route
                        path="/admin/assignorders"
                        component={AssignOrderScreen}
                        exact
                      />{" "}
                      <Route path="/search/:keyword" component={Shop} />
                      <Route path="/shop" component={Shop} />
                      <Route
                        path="/adminbanner"
                        component={AdminBannerScreen}
                      />
                      <Route
                        path="/admin/order/:id/invoice"
                        component={InvoiceScreen}
                        exact
                      />
                      <Redirect to="/admin/dashboard" />
                    </Switch>
                  </AdminLayout>
                ) : (
                  <>
                    <Nav />
                    <Route path="/" exact component={Home} />
                    <Route path="/about" component={About} />
                    <Route path="/shop" component={Shop} />
                    <Route path="/contactus" component={Contactus} />
                    <Route path="/product/:id" component={Productpage} />
                    <Route path="/cart/:id?" component={Cartpage} />
                    <Route path="/login" component={LoginScreen} />
                    <Route path="/register" component={RegisterScreen} />
                    <Route path="/profile" component={ProfileScreen} />
                    <Route path="/shipping" component={Checkout} />
                    <Route path="/placeorder" component={Placeorder} />
                    <Route path="/order/:id" component={Order} />
                    <Route path="/search/:keyword" component={Shop} />
                    <Footer />
                  </>
                )}
                <Route component={NotFoundPage} />
              </Switch>
            )}
          </ScrollIntoView>
        </Router>
      </ChakraProvider>
    </div>
  );
};
export default App;
