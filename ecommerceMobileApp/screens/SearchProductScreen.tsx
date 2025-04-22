import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import ProductCard from '../components/ProductCard'; // Create this like your web version
import { useRoute } from '@react-navigation/native';
import { searchProducts } from '../services/api';
import FilterSidebar from '../components/FilterSidebar';

const SearchProductScreen = () => {
  const route = useRoute();
  const [searchTerm, setSearchTerm] = useState(route.params?.search || '');

  const [allCategories, setAllCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  console.log(route.params)
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    categories: [],
  });

  useEffect(() => {
    if (route.params?.search) {
      setSearchTerm(route.params.search);
      setPage(0); // reset pagination if needed
    }
  }, [route.params?.search]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: rowsPerPage.toString(),
        search: searchTerm,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        cacheBuster: new Date().getTime().toString(),
      });

      const response = await searchProducts(params);
      filterCategories(response.data.content);
      setTotalItems(response.data.totalElements);

      const uniqueTags = Array.from(new Set(response.data.content.flatMap(p => p.tags.split(','))));
      setAllCategories(uniqueTags);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCategories = productsDb => {
    if (filters.categories.length > 0) {
      const filteredProducts = productsDb.filter(product => {
        const productTags = product.tags.split(',').map(tag => tag.trim());
        return productTags.some(tag => filters.categories.includes(tag));
      });
      setProducts(filteredProducts);
    } else {
      setProducts(productsDb);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, filters.categories, searchTerm]);

  const handleApply = () => {
    setPage(0);
    fetchProducts();
  };

  const handleClearAll = () => {
    setFilters({ minPrice: '', maxPrice: '', categories: [] });
    setPage(0);
    fetchProducts();
  };

  const toggleCategory = category => {
    setFilters(prev => {
      const exists = prev.categories.includes(category);
      const newCategories = exists
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category];
      return { ...prev, categories: newCategories };
    });
  };

  return (
    <ScrollView>
        <View style={styles.pageContainer}>
            {/* Left Sidebar */}
            <View style={styles.sidebar}>
                <FilterSidebar
                    filters={filters}
                    setFilters={setFilters}
                    handleApply={handleApply}
                    handleClearAll={handleClearAll}
                    allCategories={allCategories}
                />
            </View>

            {/* Main Product Area */}
            <View style={styles.main}>
                <Text style={styles.title}>Search Results for "{searchTerm}"</Text>

                {loading ? (
                <ActivityIndicator size="large" style={{ marginTop: 20 }} />
                ) : (
                <FlatList
                    numColumns={4}
                    data={products}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => <ProductCard product={item} />}
                    style={{ marginTop: 10 }}
                />
                )}

                <View style={styles.pagination}>
                <Button disabled={page === 0} onPress={() => setPage(prev => prev - 1)}>Previous</Button>
                <Text style={{ marginHorizontal: 10 }}>{`Page ${page + 1}`}</Text>
                <Button
                    disabled={(page + 1) * rowsPerPage >= totalItems}
                    onPress={() => setPage(prev => prev + 1)}
                >
                    Next
                </Button>
                </View>
            </View>
        </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    pageContainer: {
      flexDirection: 'row',
      padding: 16,
    },
    sidebar: {
      width: 280, // fixed sidebar width
      marginRight: 16,
    },
    main: {
      flex: 1,
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 12,
    },
    pagination: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20,
    },
  });
  
  export default SearchProductScreen;