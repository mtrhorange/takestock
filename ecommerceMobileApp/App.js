import { StyleSheet, View } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import DetailScreen from "./screens/DetailScreen";
import LoginScreen from "./screens/LoginScreen";
import { Provider as PaperProvider } from "react-native-paper";
import { useAuthStatus } from "./hooks/useAuthStatus";
import CustomHeader from "./components/CustomHeader";
import { CartProvider } from "./context/CartContext";
import SearchProductScreen from "./screens/SearchProductScreen";
import CartScreen from "./screens/CartScreen";
import OrderAckScreen from "./screens/OrderAckScreen";
import OrderViewScreen from "./screens/OrderViewScreen";

function MainLayout({ children }) {
  return (
    <View style={{ flex: 1 }}>
      <CustomHeader />
      {children}
    </View>
  );
}


const Stack = createNativeStackNavigator();
const theme = {
  colors: {
    text: '#000',
  },
};

export default function App() {
  const isAuthenticated = useAuthStatus();
  if (isAuthenticated === null) {
    // Still loading from AsyncStorage
    return null; // or show loading spinner
  }
  return (
    <CartProvider>
      <PaperProvider theme={{ ...theme }}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName={isAuthenticated ? "Home" : "Login"}>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="MainTabs"
              options={{ headerShown: false }}
              children={() => <MainTabs />}
            />
            <Stack.Screen
              name="Home"
              options={{ headerShown: false }}
            >
              {() => (
                <MainLayout>
                  <HomeScreen />
                </MainLayout>
              )}
            </Stack.Screen>
            <Stack.Screen
              name="Detail"
              options={{ headerShown: false }} // we'll wrap it manually
            >
              {() => (
                <MainLayout>
                  <DetailScreen />
                </MainLayout>
              )}
            </Stack.Screen>
            <Stack.Screen
              name="Search"
              options={{ headerShown: false }} // we'll wrap it manually
            >
              {() => (
                <MainLayout>
                  <SearchProductScreen />
                </MainLayout>
              )}
            </Stack.Screen>
            <Stack.Screen
              name="Cart"
              options={{ headerShown: false }} // we'll wrap it manually
            >
              {() => (
                <MainLayout>
                  <CartScreen />
                </MainLayout>
              )}
            </Stack.Screen>
            <Stack.Screen
              name="OrderAck"
              options={{ headerShown: false }} // we'll wrap it manually
            >
              {() => (
                <MainLayout>
                  <OrderAckScreen />
                </MainLayout>
              )}
            </Stack.Screen>
            <Stack.Screen
              name="Order"
              options={{ headerShown: false }} // we'll wrap it manually
            >
              {() => (
                <MainLayout>
                  <OrderViewScreen />
                </MainLayout>
              )}
            </Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </CartProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
