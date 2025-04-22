import React, { useEffect, useRef, useState } from "react";
import { View, FlatList, ActivityIndicator, ScrollView, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Card, Paragraph, Title, Button } from "react-native-paper";
import { fetchProducts, fetchRecommendProducts } from "../services/api";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProductCard from "../components/ProductCard";

const PAGE_SIZE = 3;

const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);

  const flatListRef = useRef<FlatList>(null);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await fetchProducts(currentPage, PAGE_SIZE);
      setProducts(response.data.content);
      setHasMore(!response.data.last);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadRecommendations = async () => {
    const accountRaw = await AsyncStorage.getItem("account");
    const account = JSON.parse(accountRaw || "null");
    if (account?.id) {
      const response = await fetchRecommendProducts(account.id);
      setRecommendedProducts(response.data);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [currentPage]);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const scrollLeft = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  }

  const scrollRight = () => {
    if (hasMore) {
      setCurrentPage(currentPage + 1);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>New Arrivals</Text>

      {loading ? (
        <ActivityIndicator />
      ) : (
        <View style={styles.carouselWrapper}>
          <TouchableOpacity
            onPress={() => scrollLeft()}
            style={styles.arrowButton}
          >
            <Text style={styles.arrowText}>◀</Text>
          </TouchableOpacity>

          <FlatList
            data={products}
            numColumns={3}
            renderItem={({ item }) => <ProductCard product={item} />}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            contentContainerStyle={{
              paddingBottom: 10,
            }}
            columnWrapperStyle={{
              justifyContent: "center", // ✅ center items in each row
            }}             
          />

          <TouchableOpacity
            onPress={() => scrollRight()}
            style={styles.arrowButton}
          >
            <Text style={styles.arrowText}>▶</Text>
          </TouchableOpacity>
        </View>
      )}

      {recommendedProducts.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Recommended Products</Text>
          {recommendedProducts.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </>
      )}
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  sectionTitle: {
    fontSize: 25,
    fontWeight: "bold",
    marginVertical: 12,
  },
  carouselWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  arrowButton: {
    padding: 8,
  },
  arrowText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  flatListContent: {
    gap: 10,
  },
});