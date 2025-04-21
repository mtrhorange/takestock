import React, { useEffect, useState } from "react";
import { View, FlatList, ActivityIndicator } from "react-native";
import { List, Appbar } from "react-native-paper";
import { fetchProducts } from "../services/api";

const HomeScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts()
      .then((response) => setProducts(response.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title="Products" />
      </Appbar.Header>
      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <List.Item
              title={item.name}
              description={`$${item.price}`}
              onPress={() => navigation.navigate("Detail", { product: item })}
            />
          )}
        />
      )}
    </View>
  );
};

export default HomeScreen;
