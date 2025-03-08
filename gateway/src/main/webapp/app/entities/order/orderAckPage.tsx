import { Box, Button, CardMedia, Paper, Stack, Typography } from '@mui/material';
import React from 'react';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export const OrderAckPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderDetails = location.state || null; // Get order details from checkout page

  useEffect(() => {
    if (!orderDetails) {
      navigate('/home'); // Redirect if no order data
    }
  }, [orderDetails, navigate]);

  console.warn(orderDetails);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh', // Full viewport height
        // backgroundColor: 'grey.100',
      }}
    >
      <Paper
        sx={{
          p: 4,
          maxWidth: 800, // Increased width
          width: '90%', // Ensures responsiveness
          textAlign: 'center',
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        {/* Success Icon */}
        <CheckCircleIcon sx={{ fontSize: 60, color: 'green' }} />
        <Typography variant="h5" fontWeight="bold" sx={{ mt: 2 }}>
          Order Placed Successfully!
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
          Thank you for shopping with us.
        </Typography>

        {/* Order Summary */}
        {orderDetails && (
          <Box sx={{ mt: 3, borderTop: 1, borderColor: 'grey.300', pt: 3 }}>
            <Typography variant="h6" fontWeight="bold">
              Order Summary
            </Typography>

            {orderDetails.productsOrder.map((item: any, index: number) => (
              <Paper
                key={index}
                sx={{
                  mt: 2,
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: 1,
                  borderRadius: 2,
                }}
              >
                {/* Product Image */}
                <CardMedia
                  component="img"
                  sx={{ width: 70, height: 70, objectFit: 'contain', borderRadius: 1, mx: 1 }}
                  image={item.imageUrl || '/placeholder.jpg'}
                  alt={item.name}
                />

                {/* Product Details */}
                <Box sx={{ flexGrow: 1, minWidth: 0, mx: 2 }}>
                  <Typography variant="subtitle1" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.name}
                  </Typography>
                  <Typography variant="subtitle1" color="primary">
                    ${item.price.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Qty: {item.qty}
                  </Typography>
                </Box>

                {/* Total Price */}
                <Typography fontWeight="bold">${(item.qty * item.price).toFixed(2)}</Typography>
              </Paper>
            ))}

            {/* Total Order Price */}
            <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
              Total: ${orderDetails.totalPrice.toFixed(2)}
            </Typography>
          </Box>
        )}

        {/* Buttons */}
        <Stack direction="row" spacing={2} sx={{ mt: 4, justifyContent: 'center' }}>
          <Button variant="contained" color="primary" onClick={() => navigate('/orders')} fullWidth>
            View My Orders
          </Button>
          <Button variant="outlined" color="error" onClick={() => navigate('/home')} fullWidth>
            Back to Home
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default OrderAckPage;
