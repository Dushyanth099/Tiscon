import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getInvoice } from "../../actions/orderActions";
import { Box, Text, Button, Spinner, Stack } from "@chakra-ui/react";
import { useParams } from "react-router-dom";

const InvoiceScreen = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const invoiceDetails = useSelector((state) => state.invoiceDetails);
  const { loading, error, invoice } = invoiceDetails;

  useEffect(() => {
    dispatch(getInvoice(id));
  }, [dispatch, id]);

  const handleDownload = () => {
    if (invoice && invoice.shippingLabelUrl) {
      const link = document.createElement("a");
      link.href = invoice.shippingLabelUrl;
      link.setAttribute("download", "ShippingLabel.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Box mt={7} p={5} textAlign="center">
      <h1 className="titlepanel"> Invoice Details</h1>

      {loading ? (
        <Spinner size="xl" />
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : invoice && invoice.shippingLabelUrl ? (
        <Stack direction="row" spacing={4} justify="center">
          {/* ✅ View Button */}
          <a
            href={invoice.shippingLabelUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button colorScheme="blue" size="lg">
              View
            </Button>
          </a>

          {/* ✅ Download Button */}
          <Button colorScheme="green" size="lg" onClick={handleDownload}>
            Download
          </Button>
        </Stack>
      ) : (
        <Text>No shipping label available</Text>
      )}
    </Box>
  );
};

export default InvoiceScreen;
