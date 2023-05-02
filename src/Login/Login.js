import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useForm } from 'react-hook-form';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ENDPOINT} from '../variaveis';


const Login = () => {
    const {
        register,
        handleSubmit,
        watch,
        setValue, // Ad
        formState: { isValid },
      } = useForm({ mode: 'onChange' });
      
  const navigation = useNavigation();
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    register('username', { required: true });
    register('password', { required: true });
  }, [register]);


  const onSubmit = async (data) => {
    console.log('onSubmit called with data:', data); // Adicione esta linha
    const response = await fetch(`${ENDPOINT}/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        email: data.username,
        password: data.password,
      }),
    });

    if (response.ok) {
      navigation.navigate('Main');
    } else {
      console.error('Erro na requisição:', response.status);
      setShowError(true);
    }
  };

  const handleLoginPress = () => {
    console.log('Login button pressed');
    const data = {
      username: watch('username'),
      password: watch('password'),
    };
    onSubmit(data);
  };
  
  

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Login14</Text>
      {showError && (
        <Text style={styles.errorText}>Wrong Credentials.</Text>
      )}
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCompleteType="email"
        keyboardType="email-address"
        textContentType="emailAddress"
        onChangeText={(text) => setValue('username', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        autoCompleteType="password"
        textContentType="password"
        onChangeText={(text) => setValue('password', text)}
      />
     <TouchableOpacity
 style={styles.button}
 onPress={handleLoginPress}
  
>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#08383f',
  },
  input: {
    width: '80%',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  button: {
    width: '80%',
    backgroundColor: '#008884',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
  },
});

export default Login;
