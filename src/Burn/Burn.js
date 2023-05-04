/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

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
import {LogBox, TextInput, Image, Platform} from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import { ENDPOINT, BRLA_CONTRACT_ADDRESSES} from '../variaveis';
import {useNavigation} from '@react-navigation/native';
import { BRLAContractAbi } from '../abis';
import { ethers } from 'ethers';
import {Picker} from '@react-native-picker/picker'

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
  const [availableBRLA, setAvailableBRLA] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

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
    const Sigtime = Date.now();
  
    // Adicione esta função para obter o saldo BRLA
    const getBRLABalance = async (account) => {
      const chainId = await ethereum.request({ method: 'eth_chainId' });
      const BRLAContractAddress = BRLA_CONTRACT_ADDRESSES[parseInt(chainId)];
  
      if (!BRLAContractAddress) {
        alert('Unsupported network');
        return;
      }
  
      const BRLAContract = new ethers.Contract(BRLAContractAddress, BRLAContractAbi, new ethers.providers.Web3Provider(ethereum));
      const balance = await BRLAContract.balanceOf(account);
      const formattedBalance = parseFloat(ethers.utils.formatUnits(balance, 18));
  
      setAvailableBRLA(formattedBalance);
    };
  
    // Chame a função getBRLABalance com o endereço da carteira conectada
    await getBRLABalance(accounts[0]);
  
    // ... Restante do código da função handleConnect
  };
  
  const handleBankSelection = (bank) => {
    setSelectedBank(bank);
  };

  const handleMaxValue = () => {
    setBurnValue(availableBRLA);
  };

  const handleBurn = () => {
    setModalVisible(true);
  };

  const handleConfirm = async () => {
    const ethereum = MMSDK.getProvider();

    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const fromAddress = accounts[0];
  
    const provider = new ethers.providers.Web3Provider(ethereum);
    const BRLAContract = new ethers.Contract(BRLA_CONTRACT_ADDRESS, BRLAContractAbi, provider);
  
    const SECOND = 1000;
    const expiry = Math.trunc((Date.now() + 60 * 60 * SECOND) / SECOND);
    const nonce = await BRLAContract.nonces(fromAddress).call();
    const value = (BigInt(burnValue * 100) * BigInt(10 ** 16)).toString();
    const spender = await BRLAContract.operatorWallet().call();
  
    const domain = {
      chainId: chainId,
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
  
  
  
  
  


  useEffect(() => {
    const checkWalletConnection = async () => {
      const ethereum = MMSDK.getProvider();
      try {
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        setIsWalletConnected(accounts.length > 0);
      } catch (error) {
        setIsWalletConnected(false);
      }
    };

    checkWalletConnection();
  }, []);

  return (
    <View style={styles.container}>
      {hasBankAccount ? (
        <>
          <Text style={styles.title}>Select a bank account</Text>
          <Picker
            selectedValue={selectedBank}
            style={styles.bankPicker}
            onValueChange={(itemValue, itemIndex) => handleBankSelection(itemValue)}>
            {banks.map((bank, index) => (
              <Picker.Item key={index} label={bank.accountNickname} value={bank} />
            ))}
          </Picker>
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
      {!isWalletConnected ? (
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
          style={styles.burnButton}
          onPress={handleBurn}
          disabled={!selectedBank || !burnValue || parseFloat(burnValue) <= 0}>
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
});


export default Burn;