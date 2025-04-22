import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { TextInput, Button, Checkbox } from "react-native-paper";

const FilterSidebar = ({
  filters,
  setFilters,
  handleApply,
  handleClearAll,
  allCategories,
}) => {
  const toggleCategory = (category) => {
    const selected = new Set(filters.categories);
    if (selected.has(category)) {
      selected.delete(category);
    } else {
      selected.add(category);
    }
    setFilters((prev) => ({ ...prev, categories: Array.from(selected) }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        🔍 <Text style={styles.headerBold}>SEARCH FILTER</Text>
      </Text>

      <Text style={styles.subHeader}>Price Range</Text>
      <View style={styles.priceRow}>
        <TextInput
          label="$ MIN"
          mode="outlined"
          keyboardType="numeric"
          value={filters.minPrice}
          onChangeText={(value) =>
            setFilters((prev) => ({ ...prev, minPrice: value }))
          }
          style={styles.priceInput}
        />
        <Text style={styles.dash}>–</Text>
        <TextInput
          label="$ MAX"
          mode="outlined"
          keyboardType="numeric"
          value={filters.maxPrice}
          onChangeText={(value) =>
            setFilters((prev) => ({ ...prev, maxPrice: value }))
          }
          style={styles.priceInput}
        />
      </View>

      <Button
        mode="contained"
        onPress={handleApply}
        style={styles.button}
        buttonColor="#007AFF"
        textColor="white"
      >
        APPLY
      </Button>

      {allCategories?.length > 0 && (
        <>
          <Text style={styles.subHeader}>By Category</Text>
          {allCategories.map((cat) => (
            <View key={cat} style={styles.checkboxRow}>
              <Checkbox
                status={
                  filters.categories.includes(cat) ? "checked" : "unchecked"
                }
                onPress={() => toggleCategory(cat)}
              />
              <Text
                onPress={() => toggleCategory(cat)}
                style={styles.checkboxLabel}
              >
                {cat}
              </Text>
            </View>
          ))}
        </>
      )}

      <Button
        mode="contained"
        onPress={handleClearAll}
        style={styles.clearButton}
        buttonColor="red"
        textColor="white"
      >
        CLEAR ALL
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 16,
  },
  header: {
    fontSize: 18,
    marginBottom: 12,
  },
  headerBold: {
    fontWeight: "bold",
  },
  subHeader: {
    fontSize: 16,
    marginTop: 16,
    marginBottom: 8,
    fontWeight: "600",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  priceInput: {
    flex: 1,
  },
  dash: {
    marginHorizontal: 8,
    fontSize: 18,
  },
  button: {
    marginBottom: 16,
  },
  clearButton: {
    marginTop: 16,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxLabel: {
    fontSize: 16,
  },
});

export default FilterSidebar;
