import { Box, Button, CardMedia, Checkbox, IconButton, MenuItem, Paper, Select, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Container } from 'reactstrap';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCart } from 'app/context/cartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const apiUrl = 'api/';

const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, toggleSelect, clearCart } = useCart();
  const navigate = useNavigate();
  const [selectAll, setSelectAll] = useState(false);
  const account = JSON.parse(localStorage.getItem('account') || 'null');

  // Calculate total price of selected items
  const totalPrice = cart
    .filter(item => item.selected)
    .reduce((sum, item) => sum + item.price * item.qty, 0)
    .toFixed(2);

  // Handle Select All Checkbox
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    cart.forEach(item => toggleSelect(item.productId, true));
  };

  // Navigate to product detail page
  const clickProductDetail = product => {
    navigate('/product-details', { state: { productId: product.productId } });
  };

  useEffect(() => {
    if (cart.every(item1 => item1.selected)) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [cart]);

  const clickCheckOut = () => {
    const selectedProducts = cart
      .filter(item => item.selected)
      .map(({ productId, price, qty, imageUrl, name }) => ({ productId, price, qty, imageUrl, name }));

    if (selectedProducts.length === 0) {
      console.warn('No products selected for checkout.');
      return;
    }

    const orderPayload = {
      productsOrder: selectedProducts,
      totalPrice: parseFloat(totalPrice), // Ensure it's a number, not a string
      userId1: account.id,
    };

    const requestUrl = `${apiUrl}orders/placeOrder`;
    axios.post(requestUrl, orderPayload).then(res => {
      axios.post(`${apiUrl}products/placeOrder`, selectedProducts).then(() => {
        clearCart();
        navigate('/order-ack', { state: orderPayload });
      });
    });

    console.warn(orderPayload); // Replace with API call if needed
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, pb: 8 }}>
      <Typography variant="h4" gutterBottom>
        Shopping Cart
      </Typography>

      {cart.length === 0 ? (
        <Typography variant="h6">Your cart is empty.</Typography>
      ) : (
        <>
          {cart.map(item => (
            <Paper
              key={item.productId}
              sx={{
                mb: 2,
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: 2,
                borderRadius: 2,
              }}
            >
              {/* Checkbox & Product */}
              <Stack direction="row" alignItems="center" sx={{ flexGrow: 1, overflow: 'hidden' }}>
                {/* Checkbox */}
                <Checkbox checked={item.selected} onChange={() => toggleSelect(item.productId, !item.selected)} />

                {/* Product Image */}
                <CardMedia
                  component="img"
                  sx={{ width: 80, height: 80, objectFit: 'contain', mx: 2 }}
                  image={item.imageUrl}
                  alt={item.name}
                />

                {/* Product Name & Price */}
                <Box
                  sx={{
                    flexGrow: 1, // Expands name container
                    minWidth: 0, // Prevents overflow issues
                    cursor: 'pointer',
                  }}
                  onClick={() => clickProductDetail(item)}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      whiteSpace: 'nowrap', // Tries to keep it in one line
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: 'block',
                      maxWidth: '100%', // Ensures it uses available space
                    }}
                  >
                    {item.name}
                  </Typography>
                  <Typography variant="subtitle1" color="primary">
                    ${item.price.toFixed(2)}
                  </Typography>
                </Box>
              </Stack>

              {/* Quantity Selector & Delete Button (Right Side) */}
              <Stack direction="row" alignItems="center" spacing={2}>
                <Select
                  value={item.qty}
                  onChange={e => updateQuantity(item.productId, Number(e.target.value))}
                  sx={{
                    width: 60,
                    height: 35, // Reduce height
                    '& .MuiSelect-select': { py: 0.5 }, // Fix padding
                  }}
                >
                  {[...Array(item.stock > 10 ? 10 : item.stock).keys()].map(i => (
                    <MenuItem key={i + 1} value={i + 1}>
                      {i + 1}
                    </MenuItem>
                  ))}
                </Select>

                {/* Delete Button */}
                <IconButton onClick={() => removeFromCart(item.productId)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Stack>
            </Paper>
          ))}
        </>
      )}

      {/* Sticky Checkout Bar */}
      <Paper
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          py: 2,
          px: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          bgcolor: 'white',
          boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          {/* Select All Checkbox */}
          <Checkbox checked={selectAll} onChange={handleSelectAll} />
          <Typography>Select All</Typography>
        </Stack>

        {/* Total Price & Checkout */}
        <Stack direction="row" alignItems="center" spacing={3}>
          <Typography variant="h6">
            Total ({cart.filter(item => item.selected).length} items): S${totalPrice}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            disabled={cart.filter(item => item.selected).length === 0}
            onClick={clickCheckOut}
          >
            Check Out
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};
export default CartPage;
