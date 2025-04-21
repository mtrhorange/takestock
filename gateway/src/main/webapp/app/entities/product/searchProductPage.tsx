import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import React from 'react';
import { useEffect, useState } from 'react';
import ProductCard from './productCard';
import { useLocation } from 'react-router-dom';

const FilterSidebar = ({ filters, setFilters, handleApply, handleClearAll, allCategories }) => {
  const toggleCategory = (category) => {
    const selected = new Set(filters.categories);
    selected.has(category) ? selected.delete(category) : selected.add(category);
    setFilters((prev) => ({ ...prev, categories: Array.from(selected) }));
  };

  return (
    <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <Typography variant="subtitle1" fontWeight="bold">
          <span style={{ display: 'inline-flex', alignItems: 'center' }}>
            <span style={{ fontSize: 18, marginRight: 4 }}>🔍</span> SEARCH FILTER
          </span>
        </Typography>
      </Box>
      <Typography variant="h6" gutterBottom>
        Price Range
      </Typography>
      <Box display="flex" gap={1} mb={2} justifyContent="center" alignItems="center">
        <TextField
          type="number"
          size="small"
          label="$ MIN"
          value={filters.minPrice}
          onChange={(e) => setFilters((prev) => ({ ...prev, minPrice: e.target.value }))}
        />  
        <Typography variant="body1" fontWeight="bold">
        –
        </Typography>
        <TextField
          type="number"
          size="small"
          label="$ MAX"
          value={filters.maxPrice} 
          onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))}
        />
      </Box>
      <Button variant="contained" fullWidth onClick={handleApply} sx={{ mb: 2 }}>
        APPLY
      </Button>

      {allCategories?.length > 0 ? <>
        <Divider sx={{ my: 2, backgroundColor: '#ccc' }}  /> 
        <Typography variant="h6" gutterBottom>
          By Category
        </Typography>
      </> : null}
      {allCategories?.map((cat) => (
        <FormControlLabel
          key={cat}
          control={<Checkbox checked={filters.categories.includes(cat)} onChange={() => toggleCategory(cat)} />}
          label={cat}
        />
      ))}

      <Button variant="contained" fullWidth color="error" onClick={handleClearAll} sx={{ mt: 2 }}>
        CLEAR ALL
      </Button>
    </Box>
  );
};

const apiUrl = 'api/products';
export const SearchProductPage = () => {
  const location = useLocation();
  const searchTerm = location.state?.search || '';
  const [allCategories, setAllCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    categories: [],
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: rowsPerPage.toString(),
        search: searchTerm,
        minPrice: filters.minPrice.toString(),
        maxPrice: filters.maxPrice.toString(),
        cacheBuster: new Date().getTime().toString(),
      });      

      const response = await axios.get(`${apiUrl}/search?${params}`);
      filtersCategories(response.data.content);
      setTotalItems(response.data.totalElements);
      const uniqueTags = Array.from(new Set(response.data.content.flatMap((p) => p.tags.split(','))));
      setAllCategories(uniqueTags);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, searchTerm, filters.categories]);

  const filtersCategories = (productsDb) => {
    if (filters.categories.length > 0) {
      const filteredProducts = productsDb.filter(product => {
        const productTags = product.tags.split(',').map(tag => tag.trim());
        return productTags.some(tag => filters.categories.includes(tag));
      });
      
      setProducts(filteredProducts);
    } else {
      setProducts(productsDb);
    }
  }

  const handleApply = () => {
    setPage(0);
    fetchProducts();
  };

  const handleClearAll = () => {
    setFilters({ minPrice: '', maxPrice: '', categories: [] });
    setPage(0);
    fetchProducts();
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const rows = [];
  for (let i = 0; i < products.length; i += 5) {
    rows.push(products.slice(i, i + 5));
  }

  const title = `Search Results for "${searchTerm}"`;

  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
        {title}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            handleApply={handleApply}
            handleClearAll={handleClearAll}
            allCategories={allCategories}
          />
        </Grid>

        <Grid item xs={12} md={9}>
          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                {rows.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {row.map((product) => (
                      <TableCell key={product.id} align="center">
                        <ProductCard product={product} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[10]}
                    count={totalItems}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handlePageChange}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SearchProductPage;