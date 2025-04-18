import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import axios from 'axios';
import React from 'react';
import { useEffect, useState } from 'react';
import ProductCard from './productCard';
import { useLocation } from 'react-router-dom';

const apiUrl = 'api/products';
export const SearchProductPage = () => {
  const location = useLocation();
  const searchTerm = location.state?.search || ''; // Get search term from state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(0);
  const rowsPerPage = 10; // 2 rows x 5 columns (Max 10 products per page)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const requestUrl = `${apiUrl}/search?page=${page}&size=${rowsPerPage}&search=${encodeURIComponent(
          searchTerm,
        )}&cacheBuster=${new Date().getTime()}`;
        const response = await axios.get(requestUrl);
        setProducts(response.data.content);
        setTotalItems(response.data.totalElements); // Total number of products
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, searchTerm]); // ✅ Fetch products on page change or search change

  // Convert products into rows of 5
  const rows = [];
  for (let i = 0; i < products.length; i += 5) {
    rows.push(products.slice(i, i + 5));
  }

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const title = `Search Results for "${searchTerm}"`;

  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
        {title}
      </Typography>

      {/* Product Table (2 rows, 5 columns max) */}
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {row.map(product => (
                  <TableCell key={product.id} align="center">
                    <ProductCard product={product} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>

          {/* Pagination in Table Footer */}
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[10]} // Always show 10 per page
                count={totalItems}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handlePageChange}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default SearchProductPage;
