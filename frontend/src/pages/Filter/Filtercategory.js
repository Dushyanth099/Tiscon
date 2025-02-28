import React, { useState } from "react";
import { Box, Text, Flex } from "@chakra-ui/react";

const FilterCategory = ({ title, children }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleDetails = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <Box mb={4}>
            <Flex alignItems="center" cursor="pointer" onClick={toggleDetails}>
                <Text mr={2} fontSize="24px" color="black">{isExpanded ? "-" : "+"}</Text>
                <Text fontWeight="bold" fontSize="lg">{title}</Text>
            </Flex>
            {isExpanded && <Box mt={2} p={2} border="1px solid" borderColor="gray.200">{children}</Box>}
        </Box>
    );
};

export default FilterCategory;
