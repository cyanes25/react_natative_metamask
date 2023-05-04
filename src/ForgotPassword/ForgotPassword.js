import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView
} from 'react-native';
import { useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { ENDPOINT} from '../variaveis';

const ForgotPassword = () => {
  const [successMessage, setSuccessMessage] = useState('');
  const navigation = useNavigation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isValid },
  } = useForm({ mode: 'onChange' });

  useEffect(() => {
    register('email', { required: true, pattern: /^\S+@\S+$/i });
  }, [register]);

  const onSubmit = async (data) => {
    await fetch(`${ENDPOINT}/user/forgotpassword`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
      }),
    });

    setSuccessMessage('If the email exists, password reset instructions have been sent.');
    setTimeout(() => {
      navigation.navigate('Login');
    }, 3000);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}> 
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <ScrollView>
        <View style={styles.logoContainer}>
          <Image source={require('../AddWallet/logo_corpo.png')} style={styles.logo} />
        </View>
        <Text style={styles.title}>Reset Password</Text>
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          keyboardType="email-address"
          onChangeText={(text) => setValue('email', text)}
        />
        <TouchableOpacity
          style={[styles.button]}
          onPress={handleSubmit(onSubmit)}
         
        >
          <Text style={styles.buttonText}>RESET</Text>
        </TouchableOpacity>
        {successMessage !== '' && (
          <Text style={styles.successMessage}>{successMessage}</Text>
        )}
      </ScrollView>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 20,
    color: '#000',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 16,
  },
  button: {
    width: '100%',
    backgroundColor: '#008884',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 16,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 20,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00dc84',
  },
  successMessage: {
    fontSize: 16,
    color: 'green',
    textAlign: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginTop: 50,
  },
});

export default ForgotPassword;
