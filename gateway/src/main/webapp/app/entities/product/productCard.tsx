import React from 'react';
import { Card, CardActionArea, CardActions, CardContent, CardMedia, Button, Typography } from '@mui/material';
import { useCart } from 'app/context/cartContext';
import { IProduct } from 'app/shared/model/product.model';
import { postUserAction } from 'app/apiService/service';
import { useNavigate } from 'react-router';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const account = JSON.parse(localStorage.getItem('account') || 'null');

  const add = (product1: IProduct) => {
    postUserAction(account.id, product1, 'add_to_cart');
    const obj = {
      productId: product1.id,
      name: product1.name,
      price: product1.price,
      qty: 1,
      imageUrl: product1.imageUrl,
      selected: false,
      stock: product.stock,
    };
    addToCart(obj);
  };

  const clickProductDetail = () => {
    navigate('/product-details', { state: { productId: product.id } });
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', maxWidth: 300 }}>
      <CardActionArea sx={{ flexGrow: 1 }} onClick={clickProductDetail}>
        <CardMedia
          component="img"
          sx={{
            height: 150, // Adjust height to make it more visible
            objectFit: 'contain', // Ensures full image is visible (adds whitespace if needed)
          }}
          image={product.imageUrl || 'https://via.placeholder.com/150'}
          alt={product.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h6" component="div">
            {product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {product.description || 'No description available.'}
          </Typography>
          <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
            ${product.price}
          </Typography>
        </CardContent>
      </CardActionArea>
      {/* Make the entire CardActions area clickable */}
      <CardActionArea onClick={() => add(product)} sx={{ width: '100%' }}>
        <CardActions sx={{ width: '100%' }}>
          <Button size="small" color="primary" sx={{ width: '100%' }}>
            Add to Cart
          </Button>
        </CardActions>
      </CardActionArea>
    </Card>
  );
};

export default ProductCard;
