import React from "react";
import { View, ScrollView } from "react-native";
import { Card, Title, Paragraph, Button } from "react-native-paper";

const DetailScreen = ({ route }) => {
  const { product } = route.params;

  return (
    <ScrollView>
      <Card>
        <Card.Cover
          source={{
            uri: product.imageUrl || "https://via.placeholder.com/400",
          }}
        />
        <Card.Content>
          <Title>{product.name}</Title>
          <Paragraph>${product.price}</Paragraph>
          <Paragraph>{product.description}</Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained">Add to Cart</Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  );
};

export default DetailScreen;
