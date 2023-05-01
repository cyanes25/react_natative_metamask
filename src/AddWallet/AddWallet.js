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
  TouchableOpacity
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

function AddWallet() {
  const [walletNickname, setWalletNickname] = useState('');
  const isDarkMode = useColorScheme() === 'dark';

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

  const handleConnect = async () => {
    const ethereum = MMSDK.getProvider();
    
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

    const provider = new ethers.providers.Web3Provider(ethereum);

    // Get the balance of an account (by address or ENS name, if supported by network)
    const balance = await provider.getBalance(ethereum.selectedAddress);
    
    // Often you need to format the output to something more user-friendly,
    // such as in ether (instead of wei)
    const balanceInETH = ethers.utils.formatEther(balance);
   const message = "Por favor, assine esta mensagem.";
  
  // Converta a mensagem para um hex string
  const messageHex = Buffer.from(message, 'utf8').toString('hex');
  
  // Prepare a requisição de assinatura
  const signParameters = {
    method: 'personal_sign',
    params: [messageHex, ethereum.selectedAddress],
    from: ethereum.selectedAddress,
  };
  
  // Solicite a assinatura da mensagem
  const signature = await ethereum.request(signParameters);
  
  // Agora você tem a assinatura da mensagem
  console.log('Assinatura:', signature);}

    return (
    <View style={styles.container}>
      <Image source={require('./logo_corpo.png')} style={styles.logo} />
      <Text style={styles.title}>Add wallet address</Text>
      <Text style={styles.subtitle}>Please provide the details of your wallet address</Text>
      <TextInput
        style={styles.input}
        placeholder="Wallet nickname"
        onChangeText={setWalletNickname}
        value={walletNickname}
      />
     
      
<TouchableOpacity
  style={styles.connectButton}
  onPress={handleConnect}
>
  <Text style={styles.buttonText}>CONNECT</Text>
</TouchableOpacity>

    </View>
  );
};
  
  


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    marginTop: 8,
    textAlign: 'center',
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 4,
    marginTop: 24,
    paddingLeft: 8,
  },
  connectButton: {
    backgroundColor: '#008884',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
    marginTop: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default AddWallet;
