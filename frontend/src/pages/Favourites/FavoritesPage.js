import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFavorites } from "../../actions/userActions";
import { Box, Text, Spinner, SimpleGrid } from "@chakra-ui/react";
import CardProduct from "../../components/CardProduct";
import Trust from "../../components/Trustdetails/Trust";

const FavoritesPage = () => {
  const dispatch = useDispatch();
  const { favoriteItems, loading, error } = useSelector(
    (state) => state.favorites
  );

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minH="50vh"
      >
        <Spinner size="xl" color="red.500" />
      </Box>
    );

  if (error)
    return (
      <Box textAlign="center" mt={10}>
        <Text color="red.500" fontSize="lg">
          {error}
        </Text>
      </Box>
    );

  return (
    <>
      <Box mt={20} p={6} bg="black" color="white">
        <Text fontSize="2xl" fontWeight="bold" mb={5} textAlign="center">
          Your Favorites ❤️
        </Text>

        {favoriteItems.length > 0 ? (
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
            {favoriteItems.map((product) => (
              <CardProduct key={product._id} product={product} />
            ))}
          </SimpleGrid>
        ) : (
          <Box textAlign="center" mt={10}>
            <Text fontSize="lg" color="gray.400">
              No favorites added yet. 💔
            </Text>
          </Box>
        )}
      </Box>

      <Trust />
    </>
  );
};

export default FavoritesPage;
