import React, { useState } from "react";
import { View, Alert, StyleSheet, Text, TouchableOpacity } from "react-native";
import { TextInput, Button, Title, Checkbox, useTheme } from "react-native-paper";
import { authenticate, account } from "../services/api";
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!username) {
      setError("Username cannot be empty!");
      return;
    }

    if (!password) {
      setError("Password cannot be empty!");
      return;
    }

    try {
      const res = await authenticate({ username, password });
      const token = res.data.id_token;
      await AsyncStorage.setItem("token", token);
      const resAccount = await account();
      console.log(resAccount)
      await AsyncStorage.setItem('account', JSON.stringify(resAccount.data));

      setError("");
      Alert.alert("Login successful");
      navigation.replace("Home");
    } catch (error) {
      setError("Login failed. Check your credentials or connection.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Title style={styles.title}>Sign in</Title>
        <TextInput
          label="Username"
          value={username}
          onChangeText={setUsername}
          mode="outlined"
          style={[styles.input]}
          contentStyle={{ color: "#000" }}
          theme={{
            colors: {
              text: "#000",         // input text
              primary: "#000",      // label and border when focused
              outline: "#000",      // border when NOT focused
              background: "#fff",   // input background
              placeholder: "#000",  // label color
              error: "#000",
            },
          }}
        />

        <TextInput
          label="Password"
          value={password}
          mode="outlined"
          secureTextEntry
          onChangeText={setPassword}
          style={styles.input}
          theme={{
            colors: {
              text: "#000",         // input text
              primary: "#000",      // label and border when focused
              outline: "#000",      // border when NOT focused
              background: "#fff",   // input background
              placeholder: "#000",  // label color
              error: "#000",
            },
          }}
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.checkboxContainer}>
          <Checkbox
            status={rememberMe ? "checked" : "unchecked"}
            onPress={() => setRememberMe(!rememberMe)}
          />
          <Text style={styles.checkboxLabel}>Remember me</Text>
        </View>

        <TouchableOpacity>
          <Text style={styles.link}>Did you forget your password?</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.link}>You don't have an account yet? Register a new account</Text>
        </TouchableOpacity>

        <View style={styles.buttonGroup}>
          <Button
            mode="outlined"
            style={styles.cancelBtn}
            labelStyle={styles.cancelText}
            onPress={() => {}}
          >
            Cancel
          </Button>

          <Button
            mode="contained"
            style={styles.signInBtn}
            labelStyle={styles.signInText}
            onPress={handleLogin}
          >
            Sign in
          </Button>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  card: {
    width: "100%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 5,
  },
  input: {
    marginBottom: 12,
    backgroundColor: "#fff", // fallback (should be handled by theme)
  },  
  title: { marginBottom: 16, textAlign: "center" }, 
  errorText: { color: "red", marginBottom: 8 },
  checkboxContainer: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  checkboxLabel: { marginLeft: 8 },
  link: { color: "#f0ad4e", textDecorationLine: "underline", marginBottom: 10 },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
  },
  cancelBtn: {
    borderColor: "#000",
    borderWidth: 1,
    backgroundColor: "transparent",
    borderRadius: 25,
    paddingVertical: 4,
    paddingHorizontal: 16,
    marginRight: 10,
  },
  cancelText: {
    color: "#000",
    fontWeight: "normal",
  },
  signInBtn: {
    backgroundColor: "#d6b4fc",
    borderRadius: 25,
    paddingVertical: 4,
    paddingHorizontal: 16,
  },
  signInText: {
    color: "#2c0066",
    fontWeight: "bold",
  },  
});