import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, Image , ScrollView, SafeAreaView} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ENDPOINT } from '../variaveis';

const { width } = Dimensions.get('window');

const Wallets = () => {
  const navigation = useNavigation();
  const [wallets, setWallets] = useState([]);

  useEffect(() => {
    const fetchWallets = async () => {
      const resHistory = await fetch(`${ENDPOINT}/user/wallets`, {
        method: 'GET',
        credentials: 'include',
      });

      if (resHistory.status === 401) {
        navigation.navigate('Login');
        return;
      }

      if (resHistory.status === 200) {
        const bodyJson = await resHistory.json();
        const WalletsData = bodyJson['wallets'] || [];
        setWallets(WalletsData);
      }
    };

    fetchWallets();
  }, []);


  const formatWalletAddress = (address) => {
    const firstChars = address.slice(0, 3);
    const lastChars = address.slice(-3);
    return `${firstChars}...${lastChars}`;
  };
  const formatId = (id) => {
    const firstChars = id.slice(0, 3);
    const lastChars = id.slice(-3);
    return `${firstChars}...${lastChars}`;
  };

  const EmptyWalletCard = () => {
    return (
     
      <View style={styles.card}>
        <Image
          style={styles.emptyImage}
          source={require('./blockchain.png')} // Substitua pelo caminho da imagem que deseja exibir
        />
        <Text style={styles.cardTextEmpty}>No Wallets</Text>
      </View>
    );
  };
  
  
  const WalletCard = ({ item }) => {
    return (
      <View style={styles.card}>
          <View style={styles.idContainer}>
  <Text style={styles.cardText}>ID: {formatId(item.id)}</Text>
          <TouchableOpacity onPress={() => alert(item.id)}>
          <Text style={styles.showLink}>Mostrar</Text>
          </TouchableOpacity>
          </View>
        <View style={styles.walletAddressContainer}>
          <Text style={styles.cardText}>
            Wallet Address: {formatWalletAddress(item.walletAddress)}
          </Text>
          <TouchableOpacity onPress={() => alert(item.walletAddress)}>
            <Text style={styles.showLink}>Mostrar</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.cardText}>Blockchain: {item.chain}</Text>
        <Text style={styles.cardText}>Nickname: {item.name}</Text>
      </View>
    );
  };

  const handleAddClick = () => {
    navigation.navigate("AddWallet");
  };



    
  return (
    <SafeAreaView style={{ flex: 1 }}> 
    <ScrollView vertical>
    <View style={styles.container}>
      <View style={styles.header}>
     
        <Text style={styles.title}>Address book</Text>  
          <TouchableOpacity style={styles.depositButton} onPress={handleAddClick}>
            <Text style={styles.buttonText}>ADD WALLET</Text>
          </TouchableOpacity>
        
      </View>


      <View style={styles.whiteBox}>
       
        <Text style={styles.boxSubtitle}>To remove or update an address, contact us at sac@brla.digital</Text>
      </View>

     
      
      <View style={styles.transactions}>
      <Text style={styles.transactionsTitle}>Wallets</Text>
      <FlatList
  data={wallets}
  renderItem={({ item }) => <WalletCard item={item} />}
  keyExtractor={(item) => item.id.toString()}
  ListEmptyComponent={EmptyWalletCard} // Adicione esta linha
/>

    </View>
    
    </View>
    </ScrollView>
    </SafeAreaView>
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

  walletAddressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  showLink: {
    color: '#00dc84',
    marginLeft: 8,
  },

  idContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyImage: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 16,
  },

  
  cardTextEmpty: {
    fontSize: 14,
    marginBottom: 4,
    alignSelf: 'center', // Adicione esta linha
  },
  

});

export default Wallets;

