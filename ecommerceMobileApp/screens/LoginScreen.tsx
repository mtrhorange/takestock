import React, { useState } from "react";
import { View, Alert } from "react-native";
import { TextInput, Button, Title, useTheme } from "react-native-paper";
import { authenticate } from "../services/api";

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const theme = useTheme();

  const handleLogin = async () => {
    try {
      const res = await authenticate({ username, password });
      const token = res.headers.authorization;

      if (token) {
        // Save token (you can use AsyncStorage for persistent login)
        Alert.alert("Login successful");
        navigation.replace("Home"); // Navigate to home screen
      } else {
        Alert.alert("Invalid response from server");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Login failed", "Check your credentials or connection");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Title style={{ marginBottom: 20 }}>Login</Title>
      <TextInput
        label="Username"
        value={username}
        mode="outlined"
        onChangeText={setUsername}
        style={{ marginBottom: 16 }}
      />
      <TextInput
        label="Password"
        value={password}
        mode="outlined"
        secureTextEntry
        onChangeText={setPassword}
        style={{ marginBottom: 16 }}
      />
      <Button mode="contained" onPress={handleLogin}>
        Login
      </Button>
    </View>
  );
};

export default LoginScreen;
