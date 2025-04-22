import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Button, Card, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { deteleOrder, findOneProduct, refundOrder, viewOrders } from '../services/api';

const orderTabs = [
  { label: 'All', status: 'ALL' },
  { label: 'To Pay', status: 'PENDING' },
  { label: 'To Ship', status: ['PAID', 'PROCESSING'] },
  { label: 'To Receive', status: ['SHIPPED', 'TO_RECEIVE'] },
  { label: 'Completed', status: 'COMPLETED' },
  { label: 'Cancelled', status: 'CANCELLED' },
  { label: 'Return Refund', status: 'RETURN_REFUND' },
];

const orderStatusLabel = [
  { label: 'Pending Payment', status: 'PENDING' },
  { label: 'Pending Shipping', status: ['PAID', 'PROCESSING'] },
  { label: 'Pending Delivery', status: ['SHIPPED', 'TO_RECEIVE'] },
  { label: 'Completed', status: 'COMPLETED' },
  { label: 'Cancelled', status: 'CANCELLED' },
  { label: 'Return Refund', status: 'RETURN_REFUND' },
];

const OrderViewScreen = () => {
  const [selectedTab, setSelectedTab] = useState('ALL');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const account = JSON.parse(localStorage.getItem('account') || 'null'); // Replace with async storage if needed

  const fetchOrders = async () => {
    try {
      const { data: ordersData } = await viewOrders(account.id);
      const enrichedOrders = await Promise.all(
        ordersData.map(async order => {
          const productDetails = await Promise.all(
            order.orderItemDTOList.map(async item => {
              const { data: product } = await findOneProduct(item.productId);
              return { ...item, ...product };
            })
          );
          return { ...order, orderItemDTOList: productDetails };
        })
      );
      setOrders(enrichedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders =
    selectedTab === 'ALL'
      ? orders
      : orders.filter(order => {
          const targetStatuses = orderTabs.find(tab =>
            Array.isArray(tab.status) ? tab.status.includes(order.orderDTO.orderStatus) : tab.status === order.orderDTO.orderStatus
          );
          return targetStatuses?.status.includes(order.orderDTO.orderStatus) ?? false;
        });

  const handleCancelOrder = async id => {
    await deteleOrder(id);
    fetchOrders();
  };

  const handleRefundOrder = async id => {
    await refundOrder(id);
    fetchOrders();
  };

  const getStatusLabel = status =>
    orderStatusLabel.find(s =>
      Array.isArray(s.status) ? s.status.includes(status) : s.status === status
    )?.label ?? 'Unknown';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>My Purchases</Text>

      {/* Tab Bar */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabContainer}>
        {orderTabs.map(tab => (
          <Button
            key={tab.label}
            mode={selectedTab === tab.status ? 'contained' : 'outlined'}
            onPress={() => setSelectedTab(tab.status)}
            style={styles.tabButton}
          >
            {tab.label}
          </Button>
        ))}
      </ScrollView>

      {/* Order List */}
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 10 }}>Loading orders...</Text>
        </View>
      ) : filteredOrders.length === 0 ? (
        <Text style={styles.noOrders}>No orders found in this category.</Text>
      ) : (
        filteredOrders.map(order => (
          <Card key={order.orderDTO.id} style={styles.orderCard}>
            <Text style={styles.statusText}>{getStatusLabel(order.orderDTO.orderStatus)}</Text>

            {order.orderItemDTOList.map(item => (
              <Card key={item.productId} style={styles.itemCard}>
                <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
                <View style={styles.productInfo}>
                  <Text numberOfLines={1} style={styles.productName}>{item.name}</Text>
                  <Text style={styles.productVariation}>Variation: {item.variation || 'Default'}</Text>
                  <Text style={styles.productQty}>x{item.quantity}</Text>
                </View>
                <Text style={styles.productPrice}>${(item.quantity * item.price).toFixed(2)}</Text>
              </Card>
            ))}

            <View style={styles.bottomRow}>
              <Text style={styles.totalPrice}>Total: ${order.orderDTO.totalPrice.toFixed(2)}</Text>
              <View style={styles.actions}>
                {order.orderDTO.orderStatus === 'PENDING' && (
                  <Button mode="contained" textColor="white" onPress={() => handleCancelOrder(order.orderDTO.id)} style={styles.actionBtn}>
                    Cancel
                  </Button>
                )}
                {['SHIPPED', 'TO_RECEIVE', 'PROCESSING', 'PAID'].includes(order.orderDTO.orderStatus) && (
                  <Button mode="contained" onPress={() => handleRefundOrder(order.orderDTO.id)} style={styles.actionBtn}>
                    Refund
                  </Button>
                )}
                <Button mode="outlined" onPress={() => navigation.navigate('OrderDetails', { orderId: order.orderDTO.id })} style={styles.actionBtn}>
                  View Details
                </Button>
              </View>
            </View>
          </Card>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  tabContainer: { flexDirection: 'row', marginBottom: 16 },
  tabButton: { marginRight: 8 },
  loading: { alignItems: 'center', marginTop: 40 },
  noOrders: { textAlign: 'center', fontSize: 16, marginTop: 40 },
  orderCard: { marginBottom: 20, padding: 12, borderRadius: 8 },
  statusText: { fontWeight: 'bold', color: '#007AFF', marginBottom: 8 },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    padding: 10,
    borderRadius: 8,
  },
  productImage: { width: 70, height: 70, resizeMode: 'contain', marginRight: 10 },
  productInfo: { flex: 1 },
  productName: { fontSize: 16, fontWeight: '500' },
  productVariation: { color: '#777' },
  productQty: { color: '#444' },
  productPrice: { fontWeight: 'bold' },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  totalPrice: { fontWeight: 'bold', fontSize: 16 },
  actions: { flexDirection: 'row' },
  actionBtn: { marginLeft: 8 },
});

export default OrderViewScreen;
