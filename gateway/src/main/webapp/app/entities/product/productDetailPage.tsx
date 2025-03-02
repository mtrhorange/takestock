import { Button, Card, CardMedia, Container, FormControl, Grid, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';
import { postUserAction } from 'app/apiService/service';
import { useCart } from 'app/context/cartContext';
import axios from 'axios';
import React from 'react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const ProductDetailPage = () => {
  console.warn('test');
  const { addToCart } = useCart();
  const location = useLocation();
  const id = location.state?.productId || '';
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const account = JSON.parse(localStorage.getItem('account') || 'null');

  useEffect(() => {
    axios
      .get(`/api/products/${id}`)
      .then(response => {
        setProduct(response.data);
      })
      .catch(error => {
        console.error('Error fetching product:', error);
      });
  }, [id]);

  useEffect(() => {
    if (product) {
      postUserAction(account.id, product, 'view');
    }
  }, [product]);

  const add = () => {
    postUserAction(account.id, product, 'add_to_cart');
    const obj = {
      productId: product.id,
      name: product.name,
      price: product.price,
      qty: quantity,
      imageUrl: product.imageUrl,
    };
    console.warn(obj);
    addToCart(obj);
  };

  if (!product) return <Typography variant="h5">Loading...</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        {/* Product Image */}
        <Grid item xs={12} md={5}>
          <Card>
            <CardMedia component="img" image={product.imageUrl} alt={product.name} sx={{ height: 400, objectFit: 'contain' }} />
          </Card>
        </Grid>

        {/* Product Details */}
        <Grid item xs={12} md={7}>
          <Stack spacing={2}>
            <Typography variant="h4" fontWeight="bold">
              {product.name}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {product.brand} | {product.category}
            </Typography>
            <Typography variant="h5" color="primary">
              S${product.price}
            </Typography>
            <Typography variant="body1">{product.description}</Typography>

            <Typography variant="body2" color={product.stock > 0 ? 'green' : 'red'}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </Typography>

            {/* Quantity Selector */}
            <FormControl sx={{ width: '100px' }}>
              <InputLabel>Qty</InputLabel>
              <Select label="Qty" value={quantity} onChange={e => setQuantity(Number(e.target.value))}>
                {[...Array(Math.min(product.stock, 10)).keys()].map(i => (
                  <MenuItem key={i + 1} value={i + 1}>
                    {i + 1}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Add to Cart Button */}
            <Button
              variant="contained"
              size="large"
              // sx={{ bgcolor: '#ff9900', '&:hover': { bgcolor: '#e68a00' } }}
              onClick={add}
              disabled={product.stock === 0}
              color="error"
            >
              Add to Cart
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetailPage;
