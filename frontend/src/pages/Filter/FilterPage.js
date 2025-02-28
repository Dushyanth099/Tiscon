import React, { useState, useEffect } from "react";
import { useLocation, useHistory, useParams } from "react-router-dom";
import {
  Box,
  Flex,
  Heading,
  Input,
  Select,
  Text,
  Stack,
  Button,
  Img,
  Checkbox,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Listproductbyfiters } from "../../actions/productActions";
import Filterimg from "../../assets/filtersicon.svg";
import FilterCategory from "./Filtercategory";

const FilterPage = () => {
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList); // Get product list from Redux store
  const { products, loading, error } = productList;
  const location = useLocation();
  const navigate = useNavigate();
  const { category } = useParams();

  // Function to get query params
  const getQueryParams = () => {
    return new URLSearchParams(location.search);
  };
  const forcedGender =
    category === "Men" ? "Men" : category === "Women" ? "Women" : "";

  const [filters, setFilters] = useState({
    brandname: getQueryParams().get("brandname") || "",
    gender: forcedGender || getQueryParams().get("gender") || "",
    category: getQueryParams().get("category") || "",
    subcategory: getQueryParams().get("subcategory") || "",
    type: getQueryParams().get("type") || "",
    color: getQueryParams().get("color") || "",
    fabric: getQueryParams().get("fabric") || "",
    sizes: getQueryParams().get("sizes") || "",
    from: getQueryParams().get("from") || "",
    to: getQueryParams().get("to") || "",
    discount: getQueryParams().get("discount") || "",
    rating: getQueryParams().get("rating") || "",
    sortBy: getQueryParams().get("sortBy") || "",
    keyword: getQueryParams().get("keyword") || "",
  });
  useEffect(() => {
    if (forcedGender && filters.gender !== forcedGender) {
      setFilters((prevFilters) => ({ ...prevFilters, gender: forcedGender }));
    }
  }, [category]);

  const handleCheckboxChange = (name, value) => {
    setFilters((prevFilters) => {
      const updatedValues = prevFilters[name].includes(value)
        ? prevFilters[name].filter((v) => v !== value)
        : [...prevFilters[name], value];

      return { ...prevFilters, [name]: updatedValues };
    });
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const updateURL = () => {
    const currentParams = new URLSearchParams();

    Object.keys(filters).forEach((key) => {
      if (Array.isArray(filters[key]) && filters[key].length > 0) {
        currentParams.set(key, filters[key].join(","));
      } else if (filters[key]) {
        currentParams.set(key, filters[key]);
      }
    });

    navigate({ search: `?${currentParams.toString()}` });
  };

  const handleSubmit = () => {
    updateURL();
    dispatch(Listproductbyfiters(filters));
  };

  const handleClearFilters = () => {
    setFilters((prevFilters) => {
      const preservedGender = prevFilters.gender || forcedGender; // ✅ Ensure gender is preserved

      return {
        gender: preservedGender, // ✅ Explicitly set gender
        brandname: [],
        category: [],
        subcategory: [],
        type: [],
        color: [],
        fabric: [],
        sizes: [],
        discount: [],
        rating: [],
        from: "",
        to: "",
        sortBy: "",
      };
    });

    // ✅ Ensure gender is always included in the URL
    const searchParams = new URLSearchParams();
    const currentGender = forcedGender || filters.gender;
    if (currentGender) {
      searchParams.set("gender", currentGender);
    }

    navigate({ search: `?${searchParams.toString()}` });
    dispatch(Listproductbyfiters({ gender: currentGender }));
  };
  const renderCheckboxList = (title, name, options) => (
    <Box borderBottom="3px solid #e2e8f0" pb={3} mb={3}>
      <FilterCategory title={title}>
        <VStack align="start" spacing={1}>
          {options.map((option) => (
            <Checkbox
              key={option}
              isChecked={filters[name].includes(option)}
              onChange={() => handleCheckboxChange(name, option)}
              colorScheme="teal"
            >
              {option}
            </Checkbox>
          ))}
        </VStack>
      </FilterCategory>
    </Box>
  );

  return (
    <Flex direction={{ base: "column", md: "row" }} p={4}>
      <Box
        bg="white"
        width={{ base: "100%", md: "300px" }}
        p={4}
        borderRight="3px solid #e2e8f0"
      >
        <Heading as="h3" size="md" mb={4}>
          <Flex alignItems="center">
            <Img src={Filterimg} alt="filterimg" boxSize="24px" mr={2} />
            Filters
          </Flex>
        </Heading>

        <Box borderBottom="3px solid #e2e8f0" pb={3} mb={3}></Box>
        <Stack spacing={3}>
          {renderCheckboxList("Brand Name", "brandname", [
            "Puma",
            "Nike",
            "TommyHilfigher",
            "Allensolley",
          ])}
          <Box borderBottom="3px solid #e2e8f0" pb={3} mb={3}>
            <FilterCategory title="Gender">
              <Text fontWeight="bold">{filters.gender}</Text>
            </FilterCategory>
          </Box>
          {renderCheckboxList("Category", "category", ["Shirts", "Pants"])}
          {renderCheckboxList("Subcategory", "subcategory", [
            "Shirts",
            "Jeans",
            "Pants",
            "Shorts",
            "SweatPants",
          ])}
          {renderCheckboxList("Type", "type", ["T-Shirts", "Jeans", "Jackets"])}
          {renderCheckboxList("Color", "color", [
            "Red",
            "Blue",
            "Black",
            "White",
          ])}
          {renderCheckboxList("Fabric", "fabric", [
            "Cotton",
            "Polyester",
            "Leather",
          ])}
          {renderCheckboxList("Size", "sizes", ["S", "M", "L", "XL"])}
          {renderCheckboxList("Minimum Discount", "discount", [
            "10%",
            "20%",
            "30%",
            "40%",
            "50%",
            "60%",
          ])}
          {renderCheckboxList("Minimum Rating", "rating", [
            "1",
            "2",
            "3",
            "4",
            "5",
          ])}

          <Box mt={4}>
            <Button onClick={handleSubmit} colorScheme="blue" mr={1}>
              Apply Filters
            </Button>
            <Button onClick={handleClearFilters} colorScheme="red">
              Clear Filters
            </Button>
          </Box>
        </Stack>
      </Box>
    </Flex>
  );
};

export default FilterPage;
