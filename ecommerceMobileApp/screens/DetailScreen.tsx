import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  Picker,
} from "react-native";
import { Card, Button } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";
import { useCart } from "../context/CartContext";
import { postUserAction } from "../services/api";

const DetailScreen = () => {
  const route = useRoute();
  const { product } = route.params;
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    (async () => {
      const accountRaw = await AsyncStorage.getItem("account");
      const account = JSON.parse(accountRaw || "null");
      if (account?.id && product) {
        postUserAction(account.id, product, "view");
      }
    })();
  }, [product]);

  const add = async () => {
    const accountRaw = await AsyncStorage.getItem("account");
    const account = JSON.parse(accountRaw || "null");

    if (!account?.id) return;

    postUserAction(account.id, product, "add_to_cart");

    const obj = {
      productId: product.id,
      name: product.name,
      price: product.price,
      qty: quantity,
      imageUrl: product.imageUrl,
      selected: false,
      stock: product.stock,
    };

    addToCart(obj);
  };

  return (
    <ScrollView style={{ padding: 16 }}>
      <Card style={styles.card}>
        <Image
          source={{
            uri: product.imageUrl || "https://via.placeholder.com/400",
          }}
          style={styles.image}
          resizeMode="contain"
        />
        <Card.Content>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.brandCategory}>
            {product.brand} | {product.category}
          </Text>
          <Text style={styles.price}>S${product.price}</Text>
          <Text style={styles.description}>{product.description}</Text>
          <Text
            style={[
              styles.stock,
              { color: product.stock > 0 ? "green" : "red" },
            ]}
          >
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </Text>

          {/* Quantity Picker */}
          <View style={styles.pickerWrapper}>
            <Text style={styles.qtyLabel}>Qty:</Text>
            <Picker
              selectedValue={quantity}
              style={styles.picker}
              onValueChange={(itemValue) => setQuantity(itemValue)}
            >
              {[...Array(Math.min(product.stock, 10)).keys()].map((i) => (
                <Picker.Item key={i + 1} label={`${i + 1}`} value={i + 1} />
              ))}
            </Picker>
          </View>
        </Card.Content>
        <Card.Actions>
          <Button
            mode="contained"
            onPress={add}
            disabled={product.stock === 0}
            style={styles.button}
          >
            Add to Cart
          </Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  );
};

export default DetailScreen;

const styles = StyleSheet.create({
  card: {
    paddingBottom: 16,
  },
  image: {
    width: "100%",
    height: 300,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 12,
  },
  brandCategory: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
  },
  price: {
    fontSize: 20,
    color: "#e53935",
    marginTop: 8,
  },
  description: {
    marginTop: 8,
    fontSize: 14,
    color: "#444",
  },
  stock: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "500",
  },
  pickerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  qtyLabel: {
    fontSize: 16,
    marginRight: 8,
  },
  picker: {
    width: 100,
    height: 40,
  },
  button: {
    flex: 1,
    marginTop: 12,
  },
});
