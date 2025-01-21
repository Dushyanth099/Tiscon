import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CreateProduct, listProducts } from "../../actions/productActions";
import { PRODUCT_CREATE_RESET } from "../../constants/productConstants";
import {
  Box,
  Button,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  Text,
  Stack,
  Checkbox,
  InputGroup,
  Heading,
} from "@chakra-ui/react";
import { Helmet } from "react-helmet";

const CreateProductPage = ({ history }) => {
  const [name, setName] = useState("");
  const [description, setdescription] = useState("");
  const [price, setPrice] = useState(0);
  const [oldPrice, setOldPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [Url1, setUrl1] = useState("");
  const [Url2, setUrl2] = useState("");
  const [Url3, setUrl3] = useState("");
  const [category, setCategory] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [countInStock, setcountInStock] = useState(0);
  const [images, setImages] = useState([]);
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

  const productCreate = useSelector((state) => state.productCreate);
  const { loading, error, success } = productCreate;

  useEffect(() => {
    if (success) {
      dispatch({ type: PRODUCT_CREATE_RESET });
      dispatch(listProducts());
      history.push("/admin/productlist");
    }
  }, [dispatch, success, history]);

  const submitHandler = (e) => {
    images.push(Url1);
    images.push(Url2);
    images.push(Url3);
    e.preventDefault();
    const productData = {
      name,
      price: oldPrice - (oldPrice * discount) / 100,
      oldPrice,
      images: [Url1, Url2, Url3],
      discount,
      description,
      category,
      sizes,
      countInStock,
      Url1,
      Url2,
      Url3,
      Menselected,
      Womenselected,
      Bagselected,
      Watchesselected,
      Shoesselected,
      Jacketselected,
      Sselected,
      Mselected,
      Lselected,
      XLselected,
    };
    dispatch(CreateProduct(productData));
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
    <div className="Create Product">
      <Helmet>
        <title>Create Product</title>
      </Helmet>
      {error && <Text color="red.500">{error}</Text>}
      <form onSubmit={submitHandler}>
        <div className="input-div one">
          Name :
          <div className="div">
            <InputGroup>
              <Input
                type="text"
                value={name}
                placeholder="Enter name"
                onChange={(e) => setName(e.target.value)}
              />
            </InputGroup>
          </div>
        </div>
        <div className="input-div one">
          Old Price:
          <div className="div">
            <InputGroup>
              <Input
                type="number"
                value={oldPrice}
                placeholder="Enter old price"
                onChange={(e) => setOldPrice(e.target.value)}
              />
            </InputGroup>
          </div>
        </div>

        <div className="input-div one">
          Discount (%):
          <div className="div">
            <InputGroup>
              <Input
                type="number"
                value={discount}
                placeholder="Enter discount"
                onChange={(e) => setDiscount(e.target.value)}
              />
            </InputGroup>
          </div>
        </div>

        <div className="input-div one">
          New Price:
          <div className="div">
            <InputGroup>
              <Input
                type="number"
                value={(oldPrice - (oldPrice * discount) / 100).toFixed(2)}
                readOnly
              />
            </InputGroup>
          </div>
        </div>

        <div className="input-div one">
          countInStock :
          <div className="div">
            <InputGroup>
              <Input
                type="text"
                value={countInStock}
                placeholder="Enter price"
                onChange={(e) => setcountInStock(e.target.value)}
              />
            </InputGroup>
          </div>
        </div>
        <div className="input-div one">
          Description/Category
          <div className="div">
            <Stack direction="column" spacing={4}>
              <InputGroup>
                <Textarea
                  size="sm"
                  value={description}
                  placeholder="Enter price"
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
          </div>
        </div>

        <div className="input-div pass">
          <div className="div"></div>
        </div>

        <div className="input-div pass">
          Sizes:
          <div className="div">
            <Stack direction="row">
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
          </div>
        </div>
        <div className="input-div pass">
          Urls for images:
          <div className="div urls">
            <Box>
              <Stack direction="column">
                <Input
                  type="text"
                  value={Url1}
                  onChange={(e) => {
                    setUrl1(e.target.value);
                  }}
                />
                <Input
                  type="text"
                  value={Url2}
                  onChange={(e) => {
                    setUrl2(e.target.value);
                  }}
                />
                <Input
                  type="text"
                  value={Url3}
                  onChange={(e) => {
                    setUrl3(e.target.value);
                  }}
                />
              </Stack>
            </Box>
            <Button
              type="submit"
              colorScheme="teal"
              isLoading={loading}
              loadingText="Creating..."
            >
              Create Product
            </Button>
            <form />
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateProductPage;
