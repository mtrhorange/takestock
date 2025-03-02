import React, { useEffect, useState } from 'react';
import { Box, Container, Grid, IconButton, Typography } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ProductCard from './productCard';
import { useAppSelector } from 'app/config/store';
import axios from 'axios';

const apiUrl = 'api/';

const ProductPage = () => {
  const [products, setProducts] = useState(null);
  const account = JSON.parse(localStorage.getItem('account') || 'null');

  const [recommendedProducts, setRecommendedProducts] = useState(null);
  // const [cart, setCart] = useState<{ productId: number; qty: number; price: number; name: string; imageUrl: string }[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 5;
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const requestUrl = `${apiUrl}user-activities/recommend/${account.id}`;
    axios.get(requestUrl).then(res => {
      setRecommendedProducts(res.data);
    });
  }, []);

  useEffect(() => {
    // dispatch(getEntities({ page: currentPage, size: pageSize, sort: '' }) as any);
    const requestUrl = `${apiUrl}products/pageProduct?page=${currentPage}&size=${pageSize}&sort=id,desc&cacheBuster=${new Date().getTime()}`;
    axios.get(requestUrl).then(res => {
      setProducts(res.data.content);
      setHasMore(!res.data.last); // ✅ Check if there's more data
    });
  }, [currentPage]);

  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
        New Arrivals
      </Typography>
      <Box display="flex" alignItems="center">
        <IconButton onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))} disabled={currentPage === 0}>
          <ArrowBackIosIcon />
        </IconButton>
        <Grid container spacing={3}>
          {products?.map(product => (
            <Grid item key={product.id} xs={12} sm={6} md={4}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
        <IconButton onClick={() => setCurrentPage(prev => prev + 1)} disabled={!hasMore}>
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>

      {recommendedProducts?.length > 0 && (
        <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
          Recommended Products
        </Typography>
      )}
      <Grid container spacing={3} sx={{ px: 5 }}>
        {recommendedProducts?.map(product => (
          <Grid item key={product.id} xs={12} sm={6} md={4}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ProductPage;
