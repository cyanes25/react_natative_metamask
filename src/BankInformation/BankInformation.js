import React, { useState, useEffect } from 'react';
import { useNavigation } from "@react-navigation/native";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { ENDPOINT} from '../variaveis';

import Toast from 'react-native-toast-message';
const BankInformation = ({ route }) => {
  const { bank } = route.params;
  const [nickname, setNickname] = useState('');
  const [pixKey, setPixKey] = useState('');
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);
  
  
  useEffect(() => {
    const fetchUser = async () => {

      const resHistory = await fetch(`${ENDPOINT}/user/info`, {
        method: 'GET',
        credentials: 'include',
      });

      if (resHistory.status === 401) {
        navigation.navigate('Login');
        return;
      }

      if (resHistory.status === 200) {
        const bodyJson = await resHistory.json();
        const UserData = bodyJson || [];
        setUsers(UserData);
        console.log(UserData)
      }

    };

    fetchUser();
  }, []);

  const onSubmit = async () => {
    try {
      const resHistory = await fetch(`${ENDPOINT}/user/accounts`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountNickname: nickname,
          pixKey: pixKey,
        }),
      });

      if (resHistory.ok) {
        Toast.show({
          type: 'success',
          text1: 'Bank account successfully added.',
        });
        setTimeout(() => {
          navigation.navigate('Wallets');
        }, 5000); // Aguarda 5 segundos antes de executar o navigate
      } else {
        const errorData = await resHistory.json();
        Toast.show({
          type: 'error',
          text1: `Failed to add bank account: ${errorData.message || 'An unknown error occurred.'}`,
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: `Failed to add bank account: ${error.message || 'An unknown error occurred.'}`,
      });
    }
  };


  return (
    <View style={styles.container}>
    <Text style={styles.title}>Account Bank Information</Text>
    <Image source={bank.logo} style={styles.bankLogo} />
    <TextInput
      style={styles.input}
      placeholder="Nickname"
      onChangeText={setNickname}
      value={nickname}
    />
    <TextInput
      style={styles.input}
      placeholder="PIX Key"
      onChangeText={setPixKey}
      value={pixKey}
    />
    <TouchableOpacity style={styles.button} onPress={onSubmit}>
      <Text style={styles.buttonText}>Save</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 16,
  },
  bankLogo: {
    width: 90,
    height: 90,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    width: '80%',
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#008884',
    padding: 10,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default BankInformation;
