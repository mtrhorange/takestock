import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCart } from "../context/CartContext";

const CustomHeader = () => {
  const navigation = useNavigation();
  const [searchTerm, setSearchTerm] = useState("");
  const { cart } = useCart();

  const handleSearch = async() => {
    if (searchTerm.trim()) {
      navigation.navigate("Search", { search: searchTerm.trim() });
      await AsyncStorage.setItem("searchTerm", searchTerm.trim());
    } else {
        await AsyncStorage.setItem("searchTerm", '');
    }
  };

  useEffect(() => {
    const loadSearchTerm = async() => {
        setSearchTerm(await AsyncStorage.getItem("searchTerm"));
    }
    loadSearchTerm();
  }, []);

  return (
    <View style={styles.header}>
    <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <Text style={styles.title}>🛍️ Store</Text>
    </TouchableOpacity>
      <View style={styles.searchBar}>
      <TextInput
          label="Search products"
          value={searchTerm}
          onChangeText={setSearchTerm}
          onSubmitEditing={handleSearch}
          style={styles.searchInput}
          contentStyle={{ color: "#000" }}
          theme={{
            colors: {
              text: "#000",
              primary: "#000",
              background: "#fff",
              placeholder: "#000",
            },
          }}
        />
        <IconButton icon="magnify" onPress={handleSearch} />
      </View>

      <View style={styles.rightIcons}>
        <TouchableOpacity onPress={() => navigation.navigate("Cart")}>
        <View style={styles.iconWrapper}>
            <IconButton icon="cart" iconColor="white" />
            {cart?.length > 0 && (
                <View style={styles.badge}>
                <Text style={styles.badgeText}>{cart?.length}</Text>
                </View>
            )}
        </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Order")}>
          <IconButton icon="receipt" iconColor="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#1976d2",
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 12,
  },
  searchBar: {
    // flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 20,
    // paddingHorizontal: 10,
    // marginHorizontal: 10,
    flex: 1,
    height: 44,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    color: "#000",
    height: 44,
    fontSize: 16,
    outlineStyle: 'none',
    paddingHorizontal: 10,
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrapper: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 4,
    right: 4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#d32f2f", // MUI error red
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
});
