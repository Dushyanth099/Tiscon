import React, { useEffect, useState, useRef } from "react";
import Rating from "../../components/Rating";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import {
  listProductDetails,
  createproductReview,
} from "../../actions/productActions";
import { IoLogoFacebook } from "react-icons/io";
import { AiFillTwitterCircle, AiFillInstagram } from "react-icons/ai";
import { addToCart } from "../../actions/cartActions";
import { AiFillShop } from "react-icons/ai";
import { MdDoNotDisturb } from "react-icons/md";
import {
  Image,
  Select,
  Button,
  FormControl,
  FormLabel,
  Textarea,
  toast,
  useToast,
  Heading,
} from "@chakra-ui/react";
import HashLoader from "react-spinners/HashLoader";
import { useParams } from "react-router-dom";
import {
  PRODUCT_CREATE_RESET,
  PRODUCT_CREATE_REVIEW_RESET,
} from "../../constants/productConstants";
import "./product.css";
import { Link } from "react-router-dom";
import { Listproductbyfiters } from "../../actions/productActions";
import CardProduct from "../../components/CardProduct";
import { useNavigate } from "react-router-dom";
import FeaturesSection from "../../components/Trustdetails/FeatureItem";
import Trust from "../../components/Trustdetails/Trust";

const Productpage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const relatedProductsList = useSelector((state) => state.productList);
  const { products: relatedProducts, loading: relatedLoading } =
    relatedProductsList;
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  const [qty, setQty] = useState(1);
  const [rating, setrating] = useState(0);
  const [comment, setcomment] = useState("");
  const toast = useToast();
  const imgs = document.querySelectorAll(".img-select a");
  const imgShowcase = useRef(null);
  const imgBtns = [...imgs];
  let imgId = 1;
  const dispatch = useDispatch();
  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const { success: successProductReview, error: errorProductReview } =
    productReviewCreate;

  imgBtns.forEach((imgItem) => {
    imgItem.addEventListener("click", (event) => {
      event.preventDefault();
      imgId = imgItem.dataset.id;
      slideImage();
    });
  });

  function slideImage() {
    const displayWidth = document.querySelector(
      ".img-showcase img:first-child"
    ).clientWidth;
    imgShowcase.current.style.transform = `translateX(${
      -(imgId - 1) * displayWidth
    }px)`;
  }

  useEffect(() => {
    if (successProductReview) {
      alert("Review Submitted!");
      setrating(0);
      setcomment("");
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
    }
    dispatch(listProductDetails(id));
    if (product.category) {
      dispatch(Listproductbyfiters({ category: product.category }));
    }
  }, [dispatch, id, successProductReview, product.category]);
  const submithanlder = () => {
    dispatch(
      createproductReview(id, {
        rating,
        comment,
      })
    );
  };
  //Handler of button add to cart
  const addToCartHandler = () => {
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
    dispatch(addToCart(product._id, qty));
    toast({
      title: "Product added to cart",
      description: "View your product in the cart page.",
      status: "success",
      duration: 5000,
      position: "bottom",
      isClosable: true,
    });
  };
  return (
    <>
      <Helmet>
        <title>{product?.brandname || "Product"}</title>
      </Helmet>
      <div className="productpage">
        {loading ? (
          <div className="loading-product">
            <HashLoader color={"#1e1e2c"} loading={loading} size={50} />
          </div>
        ) : error ? (
          <h2>{error} </h2>
        ) : (
          <div className="card-wrapper">
            <div className="card">
              <div className="product-imgs">
                <div className="img-select">
                  {product.images.map((image, index) => (
                    <div className="img-item" key={index}>
                      <a href="#" data-id={index + 1}>
                        <Image
                          objectFit="cover"
                          width="70px"
                          height="100px"
                          src={image}
                          alt={`Thumbnail-${index}`}
                        />
                      </a>
                    </div>
                  ))}
                </div>
                <div className="img-display">
                  <div ref={imgShowcase} className="img-showcase">
                    {product.images.map((image, index) => (
                      <Image key={index} src={image} alt={`Product-${index}`} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="product-content">
                <h2 className="product-title">{product.brandname} </h2>
                <Link to="/" className="product-link">
                  visit our store
                </Link>
                <Rating
                  value={product.rating}
                  text={`${product.numReviews} reviews`}
                />
                <div className="product-price">
                  <p className="last-price">
                    Old Price:{" "}
                    <span>
                      Rs.
                      {(product.price / (1 - product.discount / 100)).toFixed(
                        2
                      )}
                    </span>
                  </p>
                  <p className="new-price">
                    New Price:{" "}
                    <span>
                      Rs.{product.price} ({product.discount}% OFF)
                    </span>
                  </p>
                </div>
                <div className="product-detail">
                  <h2>about this item: </h2>
                  <p>{product.description}</p>
                  <div>
                    <ul>
                      <li>Size</li>{" "}
                      <Select
                        className="select-product"
                        placeholder="Choose an option"
                      >
                        {product?.productdetails?.sizes &&
                          product.productdetails.sizes
                            .split(",")
                            .map((size, index) => (
                              <option key={index} value={size.trim()}>
                                {size.trim()}
                              </option>
                            ))}
                      </Select>
                      <li>Qty :</li>
                      {product.countInStock > 0 ? (
                        <Select
                          as="select"
                          size="md"
                          maxW={20}
                          value={qty}
                          className="select-product"
                          onChange={(e) => setQty(e.target.value)}
                        >
                          {[...Array(product.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </Select>
                      ) : (
                        <span style={{ display: "flex" }}>
                          <MdDoNotDisturb size="26" /> OUT OF STOCK{" "}
                        </span>
                      )}
                    </ul>
                  </div>
                  <FeaturesSection />
                  <div className="product-info-table">
                    <div className="product-info-header">
                      <span>SPECIFICATION</span>
                    </div>
                    <div className="product-info-content">
                      <div className="product-info-column">
                        <div className="info-item">
                          <span>Category</span>
                          <strong>
                            {product?.productdetails?.category ||
                              "Not available"}
                          </strong>
                        </div>
                        <div className="info-item">
                          <span>Sub Category</span>
                          <strong>
                            {product?.productdetails?.subcategory ||
                              "Not available"}
                          </strong>
                        </div>
                        <div className="info-item">
                          <span>Age Range</span>
                          <strong>
                            {product?.productdetails?.ageRange ||
                              "Not available"}
                          </strong>
                        </div>
                        <div className="info-item">
                          <span>Gender</span>
                          <strong>
                            {product?.productdetails?.gender || "Not available"}
                          </strong>
                        </div>
                      </div>
                      <div className="product-info-column">
                        <div className="info-item">
                          <span>Product Type</span>
                          <strong>
                            {product?.productdetails?.type || "Not available"}
                          </strong>
                        </div>
                        <div className="info-item">
                          <span>Size</span>
                          <strong>
                            {product?.productdetails?.sizes || "Not available"}
                          </strong>
                        </div>
                        <div className="info-item">
                          <span>Fabric</span>
                          <strong>
                            {product?.productdetails?.fabric || "Not available"}
                          </strong>
                        </div>
                        <div className="info-item">
                          <span>Color</span>
                          <strong>
                            {product?.productdetails?.color || "Not available"}
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="product-info-table">
                    <div className="product-info-header">
                      <span>Product Details</span>
                    </div>

                    <div className="product-info-content">
                      {/* SKU Code */}
                      <div className="product-info-column">
                        <div className="info-item">
                          <span>Product Code</span>
                          <strong>{product?.SKU || "Not available"}</strong>
                        </div>
                      </div>

                      {/* Origin Address */}
                      <div className="product-info-column">
                        <div className="info-item">
                          <span>Origin Address</span>
                          <strong>
                            {product?.shippingDetails?.originAddress?.street1
                              ? `${product.shippingDetails.originAddress.street1}, 
               ${product.shippingDetails.originAddress.city}, 
               ${product.shippingDetails.originAddress.state}, 
               ${product.shippingDetails.originAddress.zip}, 
               ${product.shippingDetails.originAddress.country}`
                              : "Not available"}
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="purchase-info">
                    <Button
                      onClick={addToCartHandler}
                      type="button"
                      className="btn-shop"
                      disabled={product.countInStock === 0}
                    >
                      {" "}
                      <AiFillShop size="24" />
                      Add to Cart{" "}
                    </Button>
                  </div>
                </div>{" "}
                <div className="social-links">
                  <p>Share On: </p>
                  <Link className="social" to="#">
                    <i>
                      {" "}
                      <IoLogoFacebook size="20" />
                    </i>
                  </Link>
                  <Link className="social" to="#">
                    <i>
                      <AiFillTwitterCircle to="20" />
                    </i>
                  </Link>
                  <Link className="social" to="#">
                    <i>
                      <AiFillInstagram size="20" />{" "}
                    </i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* <div className="REVIEWS">
          <h1>Reviews :</h1>
          {product.reviews.length === 0 && <h2>NO REVIEWS</h2>}
          <div>
            {product.reviews &&
              product.reviews.map((review) => (
                <div key={review._id} className="review">
                  <h4>{review.name}</h4>
                  <div className="Ratingreview">
                    <Rating value={review.rating} />
                  </div>
                  <p className="commentreview">{review.comment}</p>
                  <p className="datereview">
                    {review.createdAt.substring(0, 10)}
                  </p>
                </div>
              ))} */}

        {/* <div className="createreview">
              <h1>Create New Review :</h1>
              {errorProductReview && <h2>{errorProductReview}</h2>}
              {userInfo ? (
                <FormControl>
                  <FormLabel>Rating :</FormLabel>
                  <Select onChange={(e) => setrating(e.target.value)}>
                    <option value="1">1 POOR</option>
                    <option value="2">2 FAIR</option>
                    <option value="3">3 GOOD</option>
                    <option value="4">4 VERY GOOD</option>
                    <option value="5">5 EXCELLENT</option>
                  </Select>
                  <FormLabel>Comment :</FormLabel>
                  <Textarea
                    onChange={(e) => setcomment(e.target.value)}
                    placeholder="Leave Comment here :"
                  />
                  <Button
                    className="
                    submitbutton"
                    colorScheme="blue"
                    onClick={submithanlder}
                  >
                    Submit
                  </Button>
                </FormControl>
              ) : (
                <>
                  Please <Link to="/login">Sign In</Link> To write a review.
                </>
              )}
            </div>
          </div>
        </div> */}

        {/* Related Products Section */}
        <div className="related-products-section">
          <Heading as="h3" size="lg" mb={4}>
            Related Products
          </Heading>
          {relatedLoading ? (
            <HashLoader color={"#36D7B7"} />
          ) : (
            <div className="related-products-container">
              {relatedProducts
                .filter((p) => p._id !== product._id) // Exclude current product
                .slice(0, 6) // Show only 6 related products
                .map((relatedProduct) => (
                  <CardProduct
                    key={relatedProduct._id}
                    product={relatedProduct}
                  />
                ))}
            </div>
          )}
        </div>
      </div>
      <Trust />
    </>
  );
};

export default Productpage;
