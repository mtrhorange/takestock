import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import {
  Checkbox,
  Button,
  IconButton,
  TextInput,
  Card,
} from "react-native-paper";
import { useCart } from "../context/CartContext"; // replace with your actual path
import { useNavigation } from "@react-navigation/native";
import { placeOrder, stockQtyUpdate } from "../services/api";

const screenWidth = Dimensions.get("window").width;

const CartScreen = () => {
  const { cart, removeFromCart, updateQuantity, toggleSelect, clearCart } =
    useCart();
  const navigation = useNavigation();
  const [selectAll, setSelectAll] = useState(false);

  const account = JSON.parse(localStorage.getItem("account") || "null");

  const totalPrice = cart
    .filter((item) => item.selected)
    .reduce((sum, item) => sum + item.price * item.qty, 0)
    .toFixed(2);

  useEffect(() => {
    setSelectAll(cart.every((item) => item.selected));
  }, [cart]);

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    cart.forEach((item) => toggleSelect(item.productId, newSelectAll));
  };

  const clickCheckOut = () => {
    const selectedProducts = cart
      .filter((item) => item.selected)
      .map(({ productId, price, qty, imageUrl, name }) => ({
        productId,
        price,
        qty,
        imageUrl,
        name,
      }));

    if (selectedProducts.length === 0) return;

    const orderPayload = {
      productsOrder: selectedProducts,
      totalPrice: parseFloat(totalPrice),
      userId1: account.id,
    };

    placeOrder(orderPayload).then(() => {
      stockQtyUpdate(selectedProducts).then(() => {
        clearCart();
        navigation.navigate("OrderAck", { orderPayload });
      });
    });
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <View style={styles.itemRow}>
        <Checkbox
          status={item.selected ? "checked" : "unchecked"}
          onPress={() => toggleSelect(item.productId, !item.selected)}
        />
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("ProductDetail", { productId: item.productId })
          }
          style={styles.itemInfo}
        >
          <Text numberOfLines={1} style={styles.productName}>
            {item.name}
          </Text>
          <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
        </TouchableOpacity>
        <View style={styles.actions}>
          <TextInput
            mode="outlined"
            value={String(item.qty)}
            onChangeText={(qty) => updateQuantity(item.productId, Number(qty))}
            keyboardType="numeric"
            style={styles.qtyInput}
          />
          <IconButton
            icon="delete"
            iconColor="red"
            onPress={() => removeFromCart(item.productId)}
          />
        </View>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shopping Cart</Text>

      {cart.length === 0 ? (
        <Text style={styles.emptyText}>Your cart is empty.</Text>
      ) : (
        <FlatList
          data={cart}
          keyExtractor={(item) => item.productId}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      {/* Sticky Footer */}
      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <Checkbox
            status={selectAll ? "checked" : "unchecked"}
            onPress={handleSelectAll}
          />
          <Text>Select All</Text>
        </View>
        <View style={styles.footerRight}>
          <Text style={styles.totalText}>
            Total ({cart.filter((item) => item.selected).length} items): S$
            {totalPrice}
          </Text>
          <Button
            mode="contained"
            onPress={clickCheckOut}
            disabled={cart.filter((item) => item.selected).length === 0}
            buttonColor="#007AFF"
            textColor="white"
          >
            Check Out
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 12 },
  emptyText: { fontSize: 18, textAlign: "center", marginTop: 50 },
  card: { marginBottom: 12, elevation: 3 },
  itemRow: { flexDirection: "row", alignItems: "center", padding: 10 },
  image: { width: 60, height: 60, resizeMode: "contain", marginRight: 10 },
  itemInfo: { flex: 1, paddingRight: 8 },
  productName: { fontSize: 16, fontWeight: "500" },
  productPrice: { fontSize: 15, color: "#007AFF" },
  actions: { flexDirection: "row", alignItems: "center" },
  qtyInput: { width: 50, height: 40, marginRight: 4, paddingHorizontal: 4 },
  footer: {
    position: "absolute",
    bottom: 0,
    width: screenWidth,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#f9f9f9",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerLeft: { flexDirection: "row", alignItems: "center" },
  footerRight: { alignItems: "flex-end", marginRight: 20 },
  totalText: { fontSize: 16, fontWeight: "600", marginBottom: 6 },
});

export default CartScreen;
