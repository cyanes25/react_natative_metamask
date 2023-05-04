import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  SafeAreaView
} from "react-native";

import { useNavigation } from "@react-navigation/native";

const banks = [
  { name: "Itaú", logo: require("./images/logo-itau-4096.png") },
  { name: "Santander", logo: require("./images/santander.png") },
  { name: "Bradesco", logo: require("./images/bradesco.png") },
  { name: "BB", logo: require("./images/logo-banco-do-brasil-4096.png") },
  { name: "Caixa", logo: require("./images/clipart1319990.png") },
  { name: "Inter", logo: require("./images/banco-inter-logo-0.png") },
  { name: "Nubank", logo: require("./images/Nubank_logo.png") },
  { name: "Btg", logo: require("./images/btg-pactual.png") },
  { name: "C6", logo: require("./images/c6-bank-logo.png") },
  { name: "Other", logo: require("./images/bank.png") },
  // Adicione mais bancos aqui
];

const BanksScreen = () => {
  const handleBankSelection = (bank) => {
    navigation.navigate("BankInformation", { bank });
  };
  const navigation = useNavigation();
  const renderItem = ({ item }) => (
<TouchableOpacity
      style={styles.bankItem}
      onPress={() => handleBankSelection(item)}
    >
      <Image source={item.logo} style={styles.bankLogo} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}> 
    <View style={styles.container}>
      <Text style={styles.title}>Banks</Text>
      <FlatList
        data={banks}
        renderItem={renderItem}
        keyExtractor={(item) => item.name}
        numColumns={2}
        columnWrapperStyle={styles.bankRow}
      />
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    marginBottom: 16,
  },
  bankRow: {
    justifyContent: "space-around",
  },
  bankItem: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    marginVertical: 8,
    width: "40%",
  },
  bankLogo: {
    width: 90,
    height: 90,
    resizeMode: "contain",
  },
  bankName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
    marginTop: 8,
  },
});

export default BanksScreen;
