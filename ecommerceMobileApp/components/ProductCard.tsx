import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Card, Title, Paragraph, Button } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { postUserAction } from "../services/api"; // your tracking API
import { useCart } from "../context/CartContext";

const ProductCard = ({ product, showDesc = false }) => {
    const navigation = useNavigation();
    const { addToCart } = useCart();
  
    const add = async () => {
      const accountRaw = await AsyncStorage.getItem("account");
      const account = JSON.parse(accountRaw || "null");
  
      if (!account?.id) return;
  
      postUserAction(product.id, account.id, "add_to_cart");
  
      const obj = {
        productId: product.id,
        name: product.name,
        price: product.price,
        qty: 1,
        imageUrl: product.imageUrl,
        selected: false,
        stock: product.stock,
      };
  
      addToCart(obj);
    };
  
    const goToDetail = () => {
      navigation.navigate("Detail", { product });
    };
  
    return (
        <Card style={styles.card}>
            <View style={styles.innerContainer}>
                <TouchableOpacity onPress={goToDetail} style={styles.bodyContainer}>
                <Image
                    source={{ uri: product.imageUrl || "https://via.placeholder.com/150" }}
                    style={styles.image}
                    resizeMode="contain"
                />
                <View style={styles.body}>
                    <Title style={styles.title}>{product.name}</Title>
                    {showDesc && (
                    <Paragraph numberOfLines={2} style={styles.desc}>
                        {product.description || "No description available."}
                    </Paragraph>
                    )}
                    <Title style={styles.price}>${product.price}</Title>
                </View>
                </TouchableOpacity>

                <View style={styles.footer}>
                <Button mode="text" onPress={add} style={styles.button}>
                    Add to Cart
                </Button>
                </View>
            </View>
        </Card>
    );
  };
  
  export default ProductCard;
  
  const styles = StyleSheet.create({
    card: {
        margin: "1%",
        width: 300,
        height: 430, // ✅ fixed height for uniformity
        backgroundColor: "#fff",
        borderRadius: 10,
        elevation: 2,
        overflow: "hidden",
      },
      
      innerContainer: {
        flex: 1,
        padding: 10,
        justifyContent: "space-between",
      },
      
      bodyContainer: {
        flexGrow: 1, // ✅ allow it to grow and fill space
      },
      
      image: {
        width: "100%",
        height: 250,
        borderRadius: 8,
      },
      
      body: {
        flexGrow: 1,
        justifyContent: "flex-start",
        marginTop: 10,
      },
      
      title: {
        fontSize: 18,
        fontWeight: "bold",
        lineHeight: 20,
      },
      
      desc: {
        fontSize: 14,
        color: "#666",
        marginTop: 2,
        lineHeight: 18,
      },
      
      price: {
        fontSize: 16,
        color: "#1976d2",
        marginTop: 4,
      },
      
      footer: {
        marginTop: 10,
        alignItems: "center",
        justifyContent: "flex-end",
      },
      
      button: {
        width: "100%",
        alignSelf: "center",
      },           
  });
  