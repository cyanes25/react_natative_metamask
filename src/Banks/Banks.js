import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, FlatList, Dimensions  } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { ENDPOINT } from '../variaveis';
import emptyImage from './transaction.png'; // Substitua pelo caminho da imagem que deseja usar

const { width } = Dimensions.get('window');

const Banks = () => {
  const [banks, setBanks] = useState([]);

  useEffect(() => {
    const fetchBanks = async () => {
      const resHistory = await fetch(`${ENDPOINT}/user/accounts`, {
        method: 'GET',
        credentials: 'include',
      });

      if (resHistory.status === 401) {
        navigation.navigate('Login');
        return;
      }

      if (resHistory.status === 200) {
        const bodyJson = await resHistory.json();
        const BanksData = bodyJson['accounts'] || [];
        setBanks(BanksData);
      }
    };

    fetchBanks();
  }, []);

  const formatId = (id) => {
    const firstChars = id.slice(0, 3);
    const lastChars = id.slice(-3);
    return `${firstChars}...${lastChars}`;
  };
  

  const TransactionCard = ({ item }) => {
    return (
      <View style={styles.card}>
        <View style={styles.idContainer}>
          <Text style={styles.cardText}>ID: {formatId(item.id)}</Text>
          <TouchableOpacity onPress={() => alert(item.id)}>
            <Text style={styles.showLink}>Mostrar</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.cardText}>Nickname: {item.accountNickname}</Text>
        <Text style={styles.cardText}>Bank Code TED: {item.bankCodeTED}</Text>
        <Text style={styles.cardText}>Bank Code PIX: {item.bankCodePIX}</Text>
        <Text style={styles.cardText}>Branch Code: {item.branchCode}</Text>
        <Text style={styles.cardText}>Account Number: {item.accountNumber}</Text>
        <Text style={styles.cardText}>PIX Key: {item.pixKey}</Text>
      </View>
    );
  };
  

  const navigation = useNavigation();
  const handleAddBank = () => {
    navigation.navigate("ChooseBank");
  };

  return (
    <ScrollView vertical>
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bank accounts</Text>
        <TouchableOpacity style={styles.depositButton} onPress={handleAddBank}>
          <Text style={styles.buttonText}>ADD BANK</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.whiteBox}>
        <Text style={styles.boxSubtitle}>To remove or update a bank account, contact us at sac@brla.digital. Learn about supported bank accounts here.</Text>
      </View>

      <View style={styles.transactions}>
        <Text style={styles.transactionsTitle}>Accounts</Text>
        <FlatList
  
  data={banks}
  renderItem={({ item }) => <TransactionCard item={item} />}
  keyExtractor={(item) => item.id.toString()}

  ListEmptyComponent={
    <View style={styles.emptyCard}>
      <Image source={emptyImage} style={styles.emptyImage} />
      <Text style={styles.emptyText}>No Accounts</Text>
    </View>
  }
/>
      </View>
    </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  buttonsContainer: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  passKycButton: {
    backgroundColor: '#00dc84',
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 8,
    
  },
  linkWalletButton: {
    backgroundColor: '#08383f',
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 8,
  },
  transferButton: {
    borderColor: '#00dc84',
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 8,
  },
  depositButton: {
    backgroundColor: '#008884',
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
  },
  whiteBox: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginTop: 24,
  },
  boxTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
    boxSubtitle: {
    fontSize: 16,
    
  },
  documentationBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  documentationContent: {
    flex: 1,
  },
  documentationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  documentationSubtitle: {
    fontSize: 14,
    marginBottom: 8,
    paddingRight: 4,
  },
  seeGuidesButton: {
    borderColor: '#00dc84',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },

  transactions: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  transactionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  card: {
    width: width - 32, // Ajuste a largura do cartão para ocupar a tela inteira
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    marginBottom: 4,
  }, 

  title: {
    fontSize: 24,
    color: '#08383f',
    marginRight: 'auto',
    marginBottom: 6,
  },

  idContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  showLink: {
    color: '#00dc84',
    marginLeft: 8,
  },

  emptyCard: {
    width: width - 32,
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  emptyImage: {
    width: 100, // Ajuste o tamanho da imagem conforme necessário
    height: 100, // Ajuste o tamanho da imagem conforme necessário
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
  },
  


});

export default Banks;

