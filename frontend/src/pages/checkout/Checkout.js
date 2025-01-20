import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Input, Stack, Select, Image, Link } from "@chakra-ui/react";
import { RiShoppingCart2Line } from "react-icons/ri";
import "./checkout.css";
import {
  saveAddressshipping,
  savepaymentmethod,
} from "../../actions/cartActions";
import { useDispatch, useSelector } from "react-redux";

const Checkout = ({ history }) => {
  const cart = useSelector((state) => state.cart);

  const { shippingAddress } = cart;
  const [doorNo, setDoorNo] = useState(shippingAddress?.doorNo || "");
  const [street, setStreet] = useState(shippingAddress?.street || "");
  const [nearestLandmark, setNearestLandmark] = useState(
    shippingAddress?.nearestLandmark || ""
  );
  const [city, setCity] = useState(shippingAddress?.city || "");
  const [state, setState] = useState(shippingAddress?.state || "");
  const [pin, setPin] = useState(shippingAddress?.pin || "");
  const [country, setCountry] = useState(shippingAddress?.country || "");
  const [phoneNumber, setPhoneNumber] = useState(
    shippingAddress?.phoneNumber || ""
  );
  const [Payment, setPayment] = useState("Card");

  const dispatch = useDispatch();
  const [carddetails, setcarddetails] = useState(true);
  const handleorder = (e) => {
    e.preventDefault();
    dispatch(
      saveAddressshipping({
        doorNo,
        street,
        nearestLandmark,
        city,
        state,
        pin,
        country,
        phoneNumber,
      })
    );
    dispatch(savepaymentmethod(Payment));
    history.push("/placeorder");
  };
  return (
    <div>
      <Helmet>
        <title>Checkout</title>
      </Helmet>

      <div className="limit-check">
        <div className="info-check">
          <form onSubmit={handleorder}>
            <div className="billing-check">
              <h1>Billing Address</h1>

              <label htmlFor="doorNo" className="this-label">
                Door Number
              </label>
              <Input
                variant="flushed"
                placeholder="Door No."
                required
                value={doorNo}
                id="doorNo"
                onChange={(e) => setDoorNo(e.target.value)}
              />

              <label htmlFor="street" className="this-label">
                Street
              </label>
              <Input
                variant="flushed"
                placeholder="Street"
                required
                value={street}
                id="street"
                onChange={(e) => setStreet(e.target.value)}
              />

              <label htmlFor="nearestLandmark" className="this-label">
                Nearest Landmark
              </label>
              <Input
                variant="flushed"
                placeholder="Nearest Landmark"
                value={nearestLandmark}
                id="nearestLandmark"
                onChange={(e) => setNearestLandmark(e.target.value)}
              />

              <label htmlFor="city" className="this-label">
                City
              </label>
              <Input
                variant="flushed"
                required
                placeholder="City"
                value={city}
                id="city"
                onChange={(e) => setCity(e.target.value)}
              />

              <label htmlFor="state" className="this-label">
                State
              </label>
              <Input
                variant="flushed"
                required
                placeholder="State"
                value={state}
                id="state"
                onChange={(e) => setState(e.target.value)}
              />

              <label htmlFor="pin" className="this-label">
                Pin Code
              </label>
              <Input
                variant="flushed"
                required
                placeholder="Pin Code"
                value={pin}
                id="pin"
                onChange={(e) => setPin(e.target.value)}
              />
              <label htmlFor="phoneNumber" className="this-label">
                Phone Number
              </label>
              <Input
                variant="flushed"
                required
                placeholder="Phone Number"
                value={phoneNumber}
                id="phoneNumber"
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <label className="this-label">Country</label>
              <Stack spacing={3}>
                <Select
                  variant="flushed"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  <option value="India">India</option>
                  <option value="America">America</option>
                  <option value="France">France</option>
                  <option value="USA">USA</option>
                </Select>
              </Stack>
            </div>
            <div className="payment-check">
              <h1>Payment Method</h1>

              <input
                onChange={(e) => {
                  setcarddetails(true);
                  setPayment("card");
                }}
                checked={carddetails}
                type="radio"
                name="payment"
                id="card"
              />
              <label for="card" className="this-label">
                Credit Card
              </label>
              <div className="accept-cards-imgs">
                <Image src="https://i.imgur.com/AHCoUZO.png" alt="visa" />
                <Image src="https://i.imgur.com/l8OAGyo.png" alt="master" />
                <Image src="https://i.imgur.com/IDHC2iv.png" alt="discover" />
              </div>
              <div className={carddetails ? "detailsenable" : "detailsdisable"}>
                <div>
                  <label for="name-card" className="this-label">
                    Name on Card
                  </label>
                  <br />
                  <Input
                    variant="flushed"
                    id="name-card"
                    placeholder="Souhail Bourhjoul"
                  />
                </div>
                <div>
                  <label for="number-card" className="this-label">
                    Credit card number
                  </label>
                  <br />
                  <Input
                    variant="flushed"
                    id="number-card"
                    placeholder="3333-1111-8888-2222"
                  />
                </div>
                <div>
                  <label for="expir-mt-card" className="this-label">
                    Exp Month
                  </label>
                  <br />
                  <Input
                    variant="flushed"
                    id="expir-mt-card"
                    placeholder="January"
                  />
                </div>
                <div className="exp-ye-cvv-check">
                  <div>
                    <label for="exp-year" className="this-label">
                      Exp Year
                    </label>
                    <Input variant="flushed" placeholder="2023" id="exp-year" />
                  </div>
                  <div>
                    <label for="cvv-check" className="this-label">
                      Cvv
                    </label>
                    <Input variant="flushed" placeholder="512" id="cvv-check" />
                  </div>
                </div>
              </div>

              <input
                onChange={(e) => {
                  setcarddetails(false);
                  setPayment("paypal");
                }}
                type="radio"
                name="payment"
                id="paypal"
              />
              <label for="paypal" className="this-label">
                {" "}
                Paypal
              </label>
              <Image
                src="https://i.imgur.com/W5vSLzb.png"
                alt="paypal"
                width="120px"
                height="40px"
              />
              {/* Cash on Delivery Option */}
              <input
                onChange={(e) => {
                  setcarddetails(false);
                  setPayment("COD");
                }}
                type="radio"
                name="payment"
                id="cod"
              />
              <label htmlFor="cod" className="this-label">
                Cash on Delivery
              </label>

              <div class="confirm">
                <input
                  type="submit"
                  className="confirm-check"
                  value="Place to order"
                />
              </div>
            </div>
          </form>
          <div class="your-products">
            {cart.cartItems.length === 0 ? (
              <h1>
                {" "}
                <RiShoppingCart2Line size="29" />
                Cart(0)
              </h1>
            ) : (
              <>
                <h1>
                  {" "}
                  <RiShoppingCart2Line size="29" />
                  Cart({cart.cartItems.length})
                </h1>
                <div className="cart-summ">
                  {cart.cartItems.map((item, index) => (
                    <p key={index}>
                      {item.qty} X{" "}
                      <Link to={`/product/${item.product}`}>{item.name}</Link>{" "}
                      <b>Rs. {item.qty * item.price}</b>
                    </p>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
