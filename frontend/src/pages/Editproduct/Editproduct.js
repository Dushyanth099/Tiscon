import axios from "axios";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  listProductDetails,
  UpdateProduct,
} from "../../actions/productActions";
import HashLoader from "react-spinners/HashLoader";
import { Helmet } from "react-helmet";

import {
  Box,
  Checkbox,
  FormControl,
  Stack,
  Textarea,
  Divider,
  Flex,
  Heading,
  InputGroup,
  Text,
  FormLabel,
  Input,
  Button,
} from "@chakra-ui/react";
import { PRODUCT_UPDATE_RESET } from "../../constants/productConstants";
import "./Editproduct.css";

const Editproduct = ({ match, history }) => {
  const productId = match.params.id;
  const [name, setName] = useState("");
  const [description, setdescription] = useState("");
  const [price, setprice] = useState(0);
  const [oldPrice, setOldPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [countInStock, setcountInStock] = useState(0);
  const [newImages, setNewImages] = useState([]);
  const [sizes, setsizes] = useState([]);
  const [category, setcategory] = useState([]);
  const [Menselected, setMenselected] = useState(false);
  const [Womenselected, setWomenselected] = useState(false);
  const [Bagselected, setBagselected] = useState(false);
  const [Watchesselected, setWatchesselected] = useState(false);
  const [Shoesselected, setShoesselected] = useState(false);
  const [Jacketselected, setJacketselected] = useState(false);

  const [Sselected, setSselected] = useState(false);
  const [Mselected, setMselected] = useState(false);
  const [Lselected, setLselected] = useState(false);
  const [XLselected, setXLselected] = useState(false);

  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);

  const { loading, error, product } = productDetails;

  const productUpdate = useSelector((state) => state.productUpdate);

  const {
    loading: lodingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate;

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      history.push("/admin/productlist");
    } else {
      if (!product.name || product._id !== productId) {
        dispatch(listProductDetails(productId));
      } else {
        setName(product.name);
        setprice(product.price);
        setOldPrice(product.oldPrice);
        setDiscount(product.discount);
        setdescription(product.description);
        setcategory(product.category);
        setsizes(product.sizes);
        setNewImages(product.images);
        setcountInStock(product.countInStock);
        setBagselected(category.includes("Bag"));
        setJacketselected(category.includes("Jacket"));
        setShoesselected(category.includes("Shoes"));
        setMenselected(category.includes("Men"));
        setWomenselected(category.includes("Women"));
        setWatchesselected(category.includes("Watches"));
        setSselected(sizes.includes("S"));
        setLselected(sizes.includes("L"));
        setMselected(sizes.includes("M"));
        setXLselected(sizes.includes("XL"));
      }
    }
    return () => {};
  }, [dispatch, productId, history, product, category, sizes, successUpdate]);
  const handleImageChange = (e) => {
    setNewImages([...newImages, e.target.files[0]]);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    const calculatedPrice = oldPrice - (oldPrice * discount) / 100;
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", calculatedPrice);
    formData.append("oldPrice", oldPrice);
    formData.append("discount", discount);
    formData.append("description", description);
    formData.append("category", JSON.stringify(category));
    formData.append("sizes", JSON.stringify(sizes));
    formData.append("countInStock", countInStock);
    formData.append("Menselected", Menselected);
    formData.append("Womenselected", Womenselected);
    formData.append(" Bagselected", Bagselected);
    formData.append("Watchesselected", Watchesselected);
    formData.append("Shoesselected", Shoesselected);
    formData.append("Jacketselected", Jacketselected);
    formData.append("Sselected", Sselected);
    formData.append("Mselected", Mselected);
    formData.append(" Lselected", Lselected);
    formData.append(" XLselected", XLselected);
    for (const pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }
    newImages.forEach((file) => {
      if (file) {
        formData.append("images", file);
      }
    });
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    dispatch(UpdateProduct(productId, formData));
  };
  const checkboxhandler = (D) => {
    let index = sizes.indexOf(D);
    if (index > -1) {
      sizes.splice(index, 1);
      console.log(sizes);
    } else {
      sizes.push(D);
      console.log(sizes);
    }
  };

  const checkboxhandlercg = (D) => {
    let index = category.indexOf(D);
    if (index > -1) {
      category.splice(index, 1);
    } else {
      category.push(D);
    }
  };

  return (
    <Box maxW="800px" mx="auto" mt={10} p={6} boxShadow="md" borderRadius="md">
      <Helmet>
        <title>Edit Product</title>
      </Helmet>
      <Heading as="h2" size="lg" mb={6} textAlign="center">
        Edit Product
      </Heading>
      {error && <h4>{error}</h4>}
      {/* {successUpdate && <h4>Profile Updated</h4>} */}
      {loading || lodingUpdate ? (
        <div className="loading">
          <HashLoader color={"#1e1e2c"} loading={lodingUpdate} size={40} />
        </div>
      ) : errorUpdate ? (
        <h4>{errorUpdate}</h4>
      ) : (
        <form onSubmit={submitHandler} encType="multipart/form-data">
          <Stack spacing={6}>
            Name :{/* Name */}
            <FormControl isRequired>
              <FormLabel>Product Name</FormLabel>
              <Input
                type="text"
                value={name}
                placeholder="Enter product name"
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>
            <Flex justify="space-between" gap={4}>
              <FormControl isRequired>
                <FormLabel>Old Price</FormLabel>
                <Input
                  type="number"
                  value={oldPrice}
                  placeholder="Enter old price"
                  onChange={(e) => setOldPrice(e.target.value)}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Discount (%)</FormLabel>
                <Input
                  type="number"
                  value={discount}
                  placeholder="Enter discount percentage"
                  onChange={(e) => setDiscount(e.target.value)}
                />
              </FormControl>

              <FormControl>
                <FormLabel>New Price</FormLabel>
                <Input
                  type="number"
                  value={(oldPrice - (oldPrice * discount) / 100).toFixed(2)}
                  readOnly
                />
              </FormControl>
            </Flex>
            <FormControl isRequired>
              <FormLabel>Stock Count</FormLabel>
              <Input
                type="number"
                value={countInStock}
                placeholder="Enter stock count"
                onChange={(e) => setcountInStock(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Stack direction="column" spacing={4}>
                <InputGroup>
                  <Textarea
                    size="sm"
                    value={description}
                    placeholder="Type Something about product.."
                    onChange={(e) => setdescription(e.target.value)}
                  />
                </InputGroup>
                <Stack direction="row">
                  <Checkbox
                    onChange={() => {
                      checkboxhandlercg("Men");
                      setMenselected(!Menselected);
                    }}
                    isChecked={Menselected}
                  >
                    Men{" "}
                  </Checkbox>
                  <Checkbox
                    onChange={() => {
                      checkboxhandlercg("Women");
                      setWomenselected(!Watchesselected);
                    }}
                    isChecked={Womenselected}
                  >
                    Women{" "}
                  </Checkbox>
                  <Checkbox
                    onChange={() => {
                      checkboxhandlercg("Bag");
                      setBagselected(!Bagselected);
                    }}
                    isChecked={Bagselected}
                  >
                    Bag{" "}
                  </Checkbox>
                  <Checkbox
                    onChange={() => {
                      checkboxhandlercg("Watches");
                      setWatchesselected(!Watchesselected);
                    }}
                    isChecked={Watchesselected}
                  >
                    Watches{" "}
                  </Checkbox>
                  <Checkbox
                    onChange={() => {
                      checkboxhandlercg("Shoes");
                      setShoesselected(!Shoesselected);
                    }}
                    isChecked={Shoesselected}
                  >
                    Shoes{" "}
                  </Checkbox>
                  <Checkbox
                    onChange={() => {
                      checkboxhandlercg("Jacket");
                      setJacketselected(!Jacketselected);
                    }}
                    isChecked={Jacketselected}
                  >
                    Jacket{" "}
                  </Checkbox>
                </Stack>
              </Stack>
            </FormControl>
            <Box>
              <Text fontWeight="bold" mb={2}>
                Sizes
              </Text>

              <Stack direction="row" spacing={4}>
                <Checkbox
                  onChange={() => {
                    checkboxhandler("S");
                    setSselected(!Sselected);
                  }}
                  isChecked={Sselected}
                >
                  S{" "}
                </Checkbox>
                <Checkbox
                  onChange={() => {
                    checkboxhandler("M");
                    setMselected(!Mselected);
                  }}
                  isChecked={Mselected}
                >
                  M{" "}
                </Checkbox>
                <Checkbox
                  onChange={() => {
                    checkboxhandler("L");
                    setLselected(!Lselected);
                  }}
                  isChecked={Lselected}
                >
                  L{" "}
                </Checkbox>
                <Checkbox
                  onChange={() => {
                    checkboxhandler("XL");
                    setXLselected(!XLselected);
                  }}
                  isChecked={XLselected}
                >
                  XL{" "}
                </Checkbox>
              </Stack>
            </Box>
            {/* Upload Images */}
            <Box>
              <FormLabel>Upload Images</FormLabel>
              <Stack spacing={3}>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Stack>
            </Box>
            <Divider />
            {/* Submit Button */}
            <Button type="submit" colorScheme="teal" w="full">
              Update Product
            </Button>
          </Stack>
        </form>
      )}
    </Box>
  );
};

export default Editproduct;
