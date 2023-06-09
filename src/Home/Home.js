import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, FlatList, Dimensions, resizeMode, SafeAreaView  } from 'react-native'; // Adicionei ScrollView aqui
import Icon from 'react-native-vector-icons/FontAwesome';
import ferramenta from './ferramenta.png'
import { IconButton, Drawer } from 'react-native-paper';
import { Alert } from 'react-native'; // Add Alert import
import { ENDPOINT} from '../variaveis';
import { useNavigation } from '@react-navigation/native';
const { width } = Dimensions.get('window');


const Home = (props) => {
  const navigation = useNavigation();
  const [drawerVisible, setDrawerVisible] = React.useState(false); // Adicione este estado para controlar a visibilidade do Drawer

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };
  const renderDrawerItem = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <Drawer.Item label={text} />
    </TouchableOpacity>
  );
  
  const [transactionData, setTransactionData] = useState([]);

  // Funções de formatação e mapeamento
  function formatDate(dateString) {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  function numberWithThousandSeparator(number) {
    return number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function mapStatus(status) {
    if (status === 'PAID') return 'success';
    if (status === 'UNPAID') return 'failed';
    return status;
  }

  const [historyData, setHistoryData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      console.log('here');

      const requestOptions =  {
        method: 'GET',
        credentials: 'include',
        
      };

      try {
          const [resHistory1, resHistory2] = await Promise.all([
              fetch(`${ENDPOINT}/user/purchases?page=1&pageSize=100`, requestOptions),
              fetch(`${ENDPOINT}/user/sales?page=1&pageSize=100`, requestOptions),
          ]);

          const json1 = resHistory1.status === 200 ? await resHistory1.json() : { depositsLogs: [] };
          const json2 = resHistory2.status === 200 ? await resHistory2.json() : { transfersLogs: [] };

          const depositsLogsWithType = (json1.depositsLogs || []).map(item => {
              return {
                  ...item,
                  type: 'mint',
                  amount: numberWithThousandSeparator(item.amount/100),
                  status: mapStatus(item.status),
              };
          });

          const transfersLogsWithTypeAndRenamed = (json2.transfersLogs || []).map(item => {
              return {
                  ...item,
                  id: item.transferId,
                  createdAt: item.transferUpdatedAt,
                  status: item.logType,
                  type: 'burn',
                  amount: `(${numberWithThousandSeparator(item.amount/100)})`,
              };
          });

          setHistoryData([...depositsLogsWithType, ...transfersLogsWithTypeAndRenamed]);
         

      } catch (error) {
          console.error('Failed to fetch data:', error);
          setHistoryData([]);
      }
    };

    fetchData();
    console.log(historyData)
  }, []);
  const formatId = (id) => {
    const firstChars = id.slice(0, 3);
    const lastChars = id.slice(-3);
    return `${firstChars}...${lastChars}`;
  };
  
  const TransactionCard = ({ item }) => {
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{item.type} - {item.status}</Text>
       
          <View style={styles.idContainer}>
  <Text style={styles.cardText}>ID: {formatId(item.id)}</Text>
          <TouchableOpacity onPress={() => alert(item.id)}>
          <Text style={styles.showLink}>Mostrar</Text>
          </TouchableOpacity>
          </View>
        <Text style={styles.cardText}>Date: {formatDate(item.createdAt)}</Text>
        <Text style={styles.cardText}>Status: {item.status}</Text>
        <Text style={styles.cardText}>Type: {item.type}</Text>
        <Text style={styles.cardText}>Amount: {item.amount}</Text>
      </View>
    );
  };
  

    const handlePassKYC = async () => {
      try {
        const resHistory = await fetch(`${ENDPOINT}/user/passkyc`, {
          method: 'PATCH',
          credentials: 'include',
        });
  
        if (resHistory.ok) {
          Alert.alert('Success', 'Bank account successfully added.', [
            { text: 'OK', onPress: () => props.navigation.navigate('Login') },
          ]);
        } else {
          const errorData = await resHistory.json();
          Alert.alert('Error', `Failed to pass KYC: ${errorData.message || 'An unknown error occurred.'}`);
        }
      } catch (error) {
        Alert.alert('Error', `Failed to pass KYC: ${error.message || 'An unknown error occurred.'}`);
      }
    };

    const navigateToAddWallet = () => {
      props.navigation.navigate('AddWallet');
    };

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


  
    const handleDepositClick = () => {
      navigation.navigate("Buy");
    };

    const handleTransferClick = () => {
      navigation.navigate("ChooseBank");
    };
  
  
    
  return (
    <SafeAreaView style={{ flex: 1 }}>
    <>
    <ScrollView vertical>
   {drawerVisible && (
  <Drawer.Section style={styles.drawer}>
    {renderDrawerItem("Profile", () => {
      closeDrawer();
      props.navigation.navigate("Profile");
    })}
    {renderDrawerItem("Limits", () => {
      closeDrawer();
      props.navigation.navigate("Limits");
    })}
   {/* {renderDrawerItem("Delayed Withdrawals", () => {
      closeDrawer();
      props.navigation.navigate("DelayedWithdrawals");
    })} */}
    {/* Adicione mais páginas aqui */}
  </Drawer.Section>
)}
    <View style={styles.container}>
    <IconButton
            icon={require('./menu.png')}
            color="#000"
            size={24}
            onPress={toggleDrawer}
            style={styles.menuIcon}
          />
      <View style={styles.header}>
     
        <View style={styles.buttonsContainer}>
     
          <TouchableOpacity style={[styles.linkWalletButton]} onPress={navigateToAddWallet}>
            <Text style={[styles.buttonText, { color: 'white', background: '#008884' }]}>LINK WALLET</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.transferButton} onPress={handleTransferClick}>
            <Text style={[styles.buttonText, { color: '#00dc84' }]}>ADD BANK</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.depositButton} onPress={handleDepositClick}>
            <Text style={styles.buttonText}>BUY</Text>
          </TouchableOpacity>
        </View>
      </View>


      <View style={styles.whiteBox}>
        <Text style={styles.boxTitle}>Main wallet balance</Text>
        <Text style={styles.boxSubtitle}>0 BRLA</Text>
      </View>

      <View style={[styles.whiteBox, styles.documentationBox]}>
      <Image source={require('./ferramenta.png')}  />

        <View style={styles.documentationContent}>
          <Text style={styles.documentationTitle}>See documentations</Text>
          <Text style={styles.documentationSubtitle}>
            Find guides and references to help with integration.
          </Text>
          <TouchableOpacity style={styles.seeGuidesButton}>
            <Text style={[styles.buttonText, { color: '#00dc84', paddingHorizontal: 0 }]}>SEE GUIDES</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.transactions}>
        <Text style={styles.transactionsTitle}>Transactions</Text>
      
        {historyData.length === 0 ? (
  <View style={styles.transactionEmptyState}>
    <Image source={require('./wallet.png')} resizeMode="contain" style={{ width: 100, height: 100 }} />
    <Text style={{ marginTop: 10 }}>No Transactions</Text>
  </View>
) : (
  <FlatList
    horizontal
    data={historyData}
    renderItem={({ item }) => <TransactionCard item={item} />}
    keyExtractor={(item) => item.id.toString()}
    showsHorizontalScrollIndicator={false}
    snapToInterval={width}
    decelerationRate="fast"
  />
)}

      </View>
     
    </View>
    </ScrollView>
    </>
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
    justifyContent: 'center', // Altere de 'flex-end' para 'center'
    alignItems: 'center',
    backgroundColor: 'transparent',
    width: '100%', // Adicione esta linha
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
    paddingHorizontal: 30,
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
    fontSize: 24,
    fontWeight: 'bold',
  },
  documentationBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imagePlaceholder: {
    background: src={ferramenta},
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
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

  transactionEmptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 24,
    width: width - 32, // Ajuste a largura do cartão para ocupar a tela inteira
  },
  showLink: {
    color: '#00dc84',
    marginLeft: 8,
    marginBottom:4
  },

  idContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  
});

export default Home;

