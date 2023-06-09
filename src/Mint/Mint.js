// src/Home.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Dimensions,
  Modal,
  SafeAreaView,
  ScrollView,
  Image
} from 'react-native';
import { useNavigation  } from '@react-navigation/native';
import { ENDPOINT } from '../variaveis';
import Toast from 'react-native-toast-message';
const AddWalletButton = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.addWalletButton}
      onPress={() => navigation.navigate('AddWallet')}
    >
      <Text style={styles.buttonText}>ADD WALLET</Text>
    </TouchableOpacity>
  );
};

const WalletItem = ({ item }) => {
  return (
    <TouchableOpacity style={styles.walletItem}>
      <Text style={styles.walletText}>{item.name}</Text>
    </TouchableOpacity>
  );
};



const Mint = () => {
  const [showQRCode, setShowQRCode] = useState(false); // Adicione esta linha
  const [walletsListVisible, setWalletsListVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null);

  const toggleWalletsListVisible = () => {
    setWalletsListVisible(!walletsListVisible);
  };

  const navigation = useNavigation();
  const [wallets, setWallets] = useState([]);
  const [amount, setAmount] = useState('');

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

  const handleMintPress = () => {
    if (selectedWallet) {
      setModalVisible(true);
    } else {
      alert("Please select a wallet.");
    }
  };
  
  
  const renderWalletItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.walletItem}>
        <Text style={styles.walletText}>{item.name}</Text>
      </TouchableOpacity>
    );
  };
  const handleConfirmPress = async () => {
    try {
      const resHistory = await fetch(`${ENDPOINT}/buy/static-pix`, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({
          walletId: selectedWallet.id,
          amount: parseFloat(amount) * 100,
        }),
      });

      if (resHistory.ok) {
        setModalVisible(false);
        setShowQRCode(true); // Mova esta linha para dentro do if
        Toast.show({
          type: 'success',
          text1: `Request successful. Please wait 1 minute for the Pix transaction to be processed.`,
        });

        


      } else {
        const errorData = await resHistory.json();
        Toast.show({
          type: 'error',
          text1: `Request failed: ${errorData.message || 'An unknown error occurred.'}`,
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: `Request failed: ${error.message || 'An unknown error occurred.'}`,
      });
    }
  };

  const WalletItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.walletItem}
        onPress={() => setSelectedWallet(item)}
      >
        <Text style={styles.walletText}>{item.name}</Text>
      </TouchableOpacity>
    );
  };


  
  const formatWalletAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 3)}...${address.slice(-3)}`;
  };

  const showAlertWithFullAddress = () => {
    if (selectedWallet) {
      alert(selectedWallet.walletAddress);
    }
  };

  const handleWalletSelection = (selectedWallet) => {
    setSelectedWallet(selectedWallet);
  };
  
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);

  const renderMintContent = () => {
    if (showQRCode) {
      return (
        <>
        <Text style={[styles.label, styles.centeredLabel]}>PIX QR Code</Text>
        <Image
          style={styles.qrCodeImage}
          source={require('./qr_code.png')}
        />
        <Text style={[styles.label, styles.centeredLabel]}>
          Amount: {parseFloat(amount).toFixed(2)} BRL
        </Text>
      </>
      );
    } else {
      return (
        <>
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            step={0.5}
            placeholder="Enter amount"
            value={amount}
            onChangeText={(text) => setAmount(text)}
          />
          <TouchableOpacity
            style={styles.addWalletButton}
            onPress={handleMintPress}
          >
            <Text style={styles.buttonText}>MINT</Text>
          </TouchableOpacity>
        </>
      );
    }
  };



 
  return (
    <SafeAreaView style={{ flex: 1 }}>
    <View>
      
    <View style={styles.container}>
      <Text style={styles.walletLabel}>Select your Wallet</Text>

      
      <TouchableOpacity
          style={styles.walletPicker}
          onPress={toggleWalletsListVisible}
        >
          <Text style={styles.walletText}>
            {selectedWallet ? selectedWallet.name : 'Choose Wallet'}
          </Text>
        </TouchableOpacity>

        {walletsListVisible && (
          <ScrollView style={styles.walletsList}>
            {wallets.map((wallet) => (
              <TouchableOpacity
                key={wallet.id}
                style={styles.walletItem}
                onPress={() => {
                  setSelectedWallet(wallet);
                  setWalletsListVisible(false);
                }}
              >
                <Text style={styles.walletText}>{wallet.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      <View style={styles.whiteBox}>
        
        <Text style={styles.boxText}>
        Always double-check that the CPF registered with your bank account
          matches the one registered with your BRLA Account to avoid issues with
          your transaction. Remember that the processing time may vary depending
          on factors such as network traffic and banking hours.
        </Text>
      </View>
      
      {renderMintContent()}
    
    <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <SafeAreaView style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <View style={styles.addressContainer}>
              <Text>
                Wallet Address: {formatWalletAddress(selectedWallet?.walletAddress)}
              </Text>
              <Text style={styles.showLink} onPress={showAlertWithFullAddress}>
                Show
              </Text>
            </View>
            <Text>Blockchain: {selectedWallet?.chain}</Text>

          <Text style={styles.warningText}>
            By confirming, you acknowledge that you have read all the information above.
          </Text>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirmPress}
          >
            <Text style={styles.buttonText}>CONFIRM</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  
    </View>
    </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  whiteBox: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 8,
  },
  boxText: {
    fontSize: 16,
    lineHeight: 24,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    marginBottom: 24,
  },
  walletItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  walletText: {
    fontSize: 16,
  },
  addWalletButton: {
    backgroundColor: '#008884',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 24,
  },
  mintButton: {
    backgroundColor: '#008884',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 24,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  walletLabel: { // Adicione o novo estilo aqui
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },

  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    width: '80%',
  },
  warningText: {
    color: 'red',
    marginBottom: 16,
  },
  confirmButton: {
    backgroundColor: '#008884',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },

  addressContainer: {
    flexDirection: 'row',
  
    alignItems: 'center',
  },
  showLink: {
    color: '#00dc84',
    paddingLeft:4
 
  },

  viewContainer: { marginHorizontal: 16, zIndex: 1 },
    androidContainer: {
      minHeight: 500,
      marginBottom: -428,
    },

    walletPicker: {
      backgroundColor: 'white',
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginBottom: 16,
    },
    walletsList: {
      backgroundColor: 'white',
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      maxHeight: 200,
    },

    qrCodeImage: {
      width: 200,
      height: 200,
      alignSelf: 'center',
      marginBottom: 16,
    },

    centeredLabel: {
      textAlign: 'center',
    },


});


export default Mint;
