import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import { Listproductbyfiters } from "../../actions/productActions";
import CardProduct from "../../components/CardProduct";
import FilterPage from "../Filter/FilterPage";
import HashLoader from "react-spinners/HashLoader";
import { Flex, Box, Text, Select } from "@chakra-ui/react";
import "./ProductsListPage.css";

const ProductsListPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get("category");
  const subcategory = searchParams.get("subcategory");
  const gender = searchParams.get("gender"); // Get gender from URL
  const keyword = searchParams.get("keyword"); // Get gender from URL
  const Bestselling = searchParams.get("brand");
  const Offerfilter = searchParams.get("offerfilter");
  const brandname = searchParams.get("brandname");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy"));

  console.log("Dispatching with:", {
    gender,
    category,
    subcategory,
    Offerfilter,
    keyword,
    brandname,
    sortBy,
  });
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

  useEffect(() => {
    dispatch(
      Listproductbyfiters({
        gender,
        category,
        subcategory,
        Offerfilter,
        keyword,
        brandname,
        sortBy,
      })
    );
  }, [
    dispatch,
    category,
    gender,
    subcategory,
    Offerfilter,
    keyword,
    brandname,
    sortBy,
  ]);
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  return (
    <Box bg="white" minH="100vh" p={4}>
      <Flex p={4} direction={{ base: "column", md: "row" }} gap={6}>
        {/* Left Side - Filter Section */}
        <Box mt={20} width={{ base: "100%", md: "25%" }}>
          <FilterPage />
        </Box>

        {/* Right Side - Product List */}
        <Box mt={20} width={{ base: "100%", md: "75%" }}>
          <Flex justify="flex-end" mb={4}>
            <Select
              value={sortBy}
              onChange={handleSortChange}
              width="200px"
              border="1px solid #ccc"
              borderRadius="4px"
              p={2}
            >
              <option value="">Sort By: Newest</option>
              <option value="Rating">Highest Rated</option>
              <option value="date">Newest</option>
              <option value="highprice">Price: High to Low</option>
              <option value="lowprice">Price: Low to High</option>
            </Select>
          </Flex>

          {loading ? (
            <Flex justify="center" align="center" height="100vh">
              <HashLoader color="#36D7B7" />
            </Flex>
          ) : error ? (
            <Text color="red.500">
              An error occurred while fetching products.
            </Text>
          ) : products.length > 0 ? (
            <Flex wrap="wrap" gap={4}>
              {products.map((product) => (
                <CardProduct key={product._id} product={product} />
              ))}
            </Flex>
          ) : (
            <Text>No products found.</Text>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default ProductsListPage;
