/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import {MetaMaskInpageProvider} from '@metamask/providers';
import React, {useEffect, useState} from 'react';
import {
  AppState,
  AppStateStatus,
  Button,
  Linking,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
  Alert,
  Modal
} from 'react-native';

import {MetaMaskSDK} from '@metamask/sdk';
import {
  CommunicationLayerMessage,
  CommunicationLayerPreference,
  DappMetadata,
  MessageType,
  RemoteCommunication,
} from '@metamask/sdk-communication-layer';
import crypto from 'crypto';
import {encrypt} from 'eciesjs';
import {LogBox, TextInput, Image, Platform, Keyboard, TouchableWithoutFeedback} from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import { ENDPOINT} from '../variaveis';
import {useNavigation} from '@react-navigation/native';
import { BRLAContractAbi } from '../abis';
import "react-native-get-random-values";
import "@ethersproject/shims";
import { ethers } from 'ethers';

// TODO how to properly make sure we only try to open link when the app is active?
// current problem is that sdk declaration is outside of the react scope so I cannot directly verify the state
// hence usage of a global variable.
let canOpenLink = true;

const MMSDK = new MetaMaskSDK({
  openDeeplink: (link: string) => {
    if (canOpenLink) {
      Linking.openURL(link);
    }
  },
  timer: BackgroundTimer,
  enableDebug: true,
  dappMetadata: {
    url: 'ReactNativeTS',
    name: 'ReactNativeTS',
  },
  storage: {
    enabled: true,
  },
});

function Burn() {

  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const isDarkMode = useColorScheme() === 'dark';
  const navigation = useNavigation();


  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppState);

    return () => {
      subscription.remove();
    };
  }, []);

  const handleAppState = (appState: AppStateStatus) => {
    console.debug(`AppState change: ${appState}`);
    canOpenLink = appState === 'active';
  };



  const backgroundStyle = {
    backgroundColor: Colors.lighter,
  };

  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  const [hasBankAccount, setHasBankAccount] = useState(false);
  const [burnValue, setBurnValue] = useState('');
  const [availableBRLA, setAvailableBRLA] = useState(-1);
  const [modalVisible, setModalVisible] = useState(false);
  const [BRLAc, setBRLAc] = useState('');

  const [users, setUsers] = useState([]);
  
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
        console.log(banks);
        setHasBankAccount(BanksData.length > 0);
      }
    };

    fetchBanks();
  }, []);

  // ... Add other useEffect hooks

  const handleAddBankAccount = () => {
    navigation.navigate('ChooseBank');
  };
  const handleConnect = async () => {
    const ethereum = MMSDK.getProvider();
    
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const walletAddress = accounts[0];
    const provider = new ethers.providers.Web3Provider(ethereum);

    const chainId = await ethereum.request({ method: 'eth_chainId' });
    const chainIdDecimal = parseInt(chainId, 16);

    const chainName = getChainName(chainIdDecimal); // Nome da rede

    const BRLA_CONTRACT_ADDRESSES = '0x658e5EA3c7690f0626aFF87cEd6FC30021A93657'

    const BRLAContract = new ethers.Contract(BRLA_CONTRACT_ADDRESSES, BRLAContractAbi, provider);
  
    // 2. Use a função `balanceOf` para obter o saldo do usuário
    const balance = await BRLAContract.balanceOf(walletAddress);
    setAvailableBRLA(ethers.utils.formatUnits(balance, 18));
    setBRLAc(BRLAContract);
  
  
    
  };
  
  const handleBankSelection = (item) => {
    setSelectedBank(item.value);
  };
  
  

  const handleMaxValue = () => {
    setBurnValue(availableBRLA);
  };

  const handleBurn = () => {
    setModalVisible(true);
  };

  
  const getChainName = (chainId) => {
    if ([1, 11155111].includes(chainId)) {
      return 'Ethereum';
    } else if ([137, 80001].includes(chainId)) {
      return 'Polygon';
    } else if ([66, 65].includes(chainId)) {
      return 'OKC';
    }
    return 'Unknown';
  };


  const handleConfirm = async () => {
    const fromAddress ='0xE3401F9f1A229F4e76c3292dB47e1315BDfB057e';
  
    const chainIdDecimal = '80001';
    const BRLA_CONTRACT_ADDRESS = '0x658e5EA3c7690f0626aFF87cEd6FC30021A93657';

    const BRLAContract=BRLAc;
    const SECOND = 1000;
    const expiry = Math.trunc((Date.now() + 60 * 60 * SECOND) / SECOND);
    const nonce = await BRLAContract.nonces(fromAddress).call();
    const value = (BigInt(burnValue * 100) * BigInt(10 ** 16)).toString();
    const spender = await BRLAContract.operatorWallet().call();
  
    const domain = {
      chainId: chainIdDecimal,
      name: 'BRLA Token',
      verifyingContract: BRLA_CONTRACT_ADDRESS,
      version: '1',
    };
  
    const message = {
      owner: fromAddress,
      spender,
      value,
      nonce,
      deadline: expiry,
    };
  
    const types = {
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'verifyingContract', type: 'address' },
      ],
      Permit: [
        { name: 'owner', type: 'address' },
        { name: 'spender', type: 'address' },
        { name: 'value', type: 'uint256' },
        { name: 'nonce', type: 'uint256' },
        { name: 'deadline', type: 'uint256' },
      ],
    };
  
    const signer = provider.getSigner();
    const sig = await signer._signTypedData(domain, types, message);
  
    try {
      const response = await fetch(`${ENDPOINT}/sell`, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({
          accountId: selectedBankData.id,
          walletId: internalWalletId,
          amount: burnValue * 100,
          permit: {
            deadline: sig.deadline,
            r: sig.r,
            s: sig.s,
            v: sig.v,
            nonce: parseInt(sig.nonce),
          },
        }),
      });
  
      if (response.ok) {
        alert.success('Request successfully made. Please wait up to 1 minute for the Burn to be processed.');
        setShowPopup(false);
      } else {
        alert.error('Error in server response:', response.status, response.statusText);
        const errorData = await response.json();
        alert.error(`Error: ${errorData.message || 'An unknown error occurred.'}`);
      }
    } catch (error) {
      alert.error('Error making request:', error);
      alert.error(`Error making request: ${error.message || 'An unknown error occurred.'}`);
    }
  };
  
  
  
  
  



  
  const WalletItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.walletItem}>
        <Text style={styles.walletText}>{item.name}</Text>
      </TouchableOpacity>
    );
  };
  const [walletsListVisible, setWalletsListVisible] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null);

  const toggleWalletsListVisible = () => {
    setWalletsListVisible(!walletsListVisible);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <SafeAreaView style={{ flex: 1 }}> 
    <View style={styles.container}>
      {hasBankAccount ? (
        <>
          <Text style={styles.title}>Select a bank account</Text>
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
            {banks.map((bank) => (
              <TouchableOpacity
                key={bank.id}
                style={styles.walletItem}
                onPress={() => {
                  setSelectedWallet(bank);
                  setWalletsListVisible(false);
                }}
              >
                <Text style={styles.walletText}>{bank.accountNickname}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
        </>
      ) : (
        <TouchableOpacity style={styles.addButton} onPress={handleAddBankAccount}>
          <Text style={styles.buttonText}>ADD BANK ACCOUNT</Text>
        </TouchableOpacity>
      )}
      <View style={styles.warningBox}>
        <Text style={styles.warningText}>
          Important: Always double-check that the CPF registered with your bank account matches the one registered with your BRLA Account to avoid issues with your transaction. Remember that the processing time may vary depending on factors such as network traffic and banking hours.
        </Text>
      </View>
      {availableBRLA === -1 ? (
  <TouchableOpacity style={styles.connectButton} onPress={handleConnect}>
    <Text style={styles.buttonText}>CONNECT WALLET</Text>
  </TouchableOpacity>
) : (
  <>
    <TextInput
      style={styles.amountInput}
      placeholder="Amount"
      value={burnValue}
      onChangeText={(value) => setBurnValue(value)}
      keyboardType="numeric"
    />
    <Text style={styles.availableText}>
      Available: {availableBRLA}{' '}
      <Text style={styles.maxText} onPress={handleMaxValue}>
        max
      </Text>
    </Text>
    <TouchableOpacity
  style={[
    styles.burnButton,
    !selectedBank || !burnValue || parseFloat(burnValue) <= 0
      ? styles.burnButtonDisabled
      : {},
  ]}
  onPress={handleBurn}
  >
  <Text style={styles.buttonText}>BURN</Text>
</TouchableOpacity>

  </>
)}

      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Confirm Burn</Text>
          <Text style={styles.modalText}>
            Are you sure you want to burn {burnValue} BRLA and send it to the selected bank account?
          </Text>
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalConfirmButton]}
              onPress={handleConfirm}>
              <Text style={styles.modalButtonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalCancelButton]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
    </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  bankPicker: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 16,
  },
  warningBox: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 8,
  },
  warningText: {
    fontSize: 16,
    lineHeight: 24,
  },
  amountInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    marginBottom: 8,
  },
  availableText: {
    fontSize: 16,
    marginBottom: 16,
  },
  maxText: {
    color: '#00dc84',
  },
  addButton: {
    backgroundColor: '#008884',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  connectButton: {
    backgroundColor: '#008884',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  burnButton: {
    backgroundColor: '#008884',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 24,
    opacity: 1,
  },
  burnButtonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    width: '80%',
    alignSelf: 'center',
    marginTop: '50%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 16,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalButton: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  modalConfirmButton: {
    backgroundColor: '#008884',
  },
  modalCancelButton: {
    backgroundColor: '#ccc',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
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


});


export default Burn;