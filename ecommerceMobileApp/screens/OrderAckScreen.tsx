import React, { useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Button, Card, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const OrderAckScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const orderDetails = route.params?.orderPayload;

  useEffect(() => {
    if (!orderDetails) {
      navigation.replace('Home');
    }
  }, [orderDetails]);

  if (!orderDetails) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Icon name="check-circle" size={60} color="green" style={styles.successIcon} />
        <Text style={styles.title}>Order Placed Successfully!</Text>
        <Text style={styles.subText}>Thank you for shopping with us.</Text>

        <Divider style={{ marginVertical: 20 }} />

        <Text style={styles.summaryTitle}>Order Summary</Text>

        {orderDetails.productsOrder.map((item, index) => (
          <Card key={index} style={styles.itemCard}>
            <Image
              source={{ uri: item.imageUrl || 'https://via.placeholder.com/70' }}
              style={styles.image}
            />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
              <Text style={styles.qty}>Qty: {item.qty}</Text>
            </View>
            <Text style={styles.totalPrice}>
              ${(item.qty * item.price).toFixed(2)}
            </Text>
          </Card>
        ))}

        <Text style={styles.totalAmount}>
          Total: ${orderDetails.totalPrice.toFixed(2)}
        </Text>

        <View style={styles.buttonRow}>
          <Button mode="contained" onPress={() => navigation.navigate('Orders')} style={styles.button}>
            View My Orders
          </Button>
          <Button mode="outlined" textColor="red" onPress={() => navigation.navigate('Home')} style={styles.button}>
            Back to Home
          </Button>
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: Dimensions.get('window').height,
  },
  card: {
    padding: 20,
    width: '100%',
    maxWidth: 800,
    alignItems: 'center',
    borderRadius: 12,
    elevation: 4,
  },
  successIcon: {
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  subText: {
    fontSize: 16,
    color: '#666',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    width: '100%',
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
    resizeMode: 'contain',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 10,
    minWidth: 0,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
  },
  itemPrice: {
    color: '#007AFF',
    fontSize: 15,
  },
  qty: {
    color: '#666',
    fontSize: 14,
  },
  totalPrice: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    alignSelf: 'flex-end',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 24,
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    marginHorizontal: 6,
  },
});

export default OrderAckScreen;
