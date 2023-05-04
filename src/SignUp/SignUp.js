import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { useForm } from 'react-hook-form';
import zxcvbn from 'zxcvbn';
import { ENDPOINT} from '../variaveis';
import { useNavigation } from '@react-navigation/native';
const SignUp = () => {
    const navigation = useNavigation();
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showPasswordsMismatchMessage, setShowPasswordsMismatchMessage] = useState(false);


    const {
        register,
        handleSubmit,
        setValue,
        trigger,
        formState: { isValid },
      } = useForm({ mode: 'onChange' });
    
    
      useEffect(() => {
        register('firstName', { required: true });
        register('lastName', { required: true });
        register('country', { required: true });
        register('email', { required: true, pattern: /^\S+@\S+$/i });
        register('password', { required: true });
        register('confirmPassword', { required: true });
      }, [register]);



  const [passwordStrengthScore, setPasswordStrengthScore] = useState(0);
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const onPasswordConfirmationChange = (text) => {
    setPasswordConfirmation(text);
    setValue('confirmPassword', text);
    trigger('confirmPassword');
  };

  const onPasswordChange = (text) => {
    const newPassword = text;
    const result = zxcvbn(newPassword);
    setPasswordStrengthScore(result.score);
    setPassword(newPassword);
    setValue('password', text);
    trigger('password');
  };


  const doPasswordsMatch = () => {
    return password === passwordConfirmation;
  };

 

  const doesPasswordMeetCriteria = () => {
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialCharacter = /[^a-zA-Z0-9]/.test(password);

    return (
      password.length >= 8 &&
      hasUppercase &&
      hasLowercase &&
      hasNumber &&
      hasSpecialCharacter
    );
  };

  const getPasswordCriteriaColor = () => {

    return doesPasswordMeetCriteria() ? 'black' : 'red';
};



  

const getPasswordStrengthColor = () => {
  switch (passwordStrengthScore) {
    case 0:
      return '#ddd';
    case 1:
      return 'red';
    case 2:
      return 'orange';
    case 3:
      return 'yellow';
    case 4:
      return 'green';
    default:
      return '#ddd';
  }
};



const isButtonDisabled = () => {
    return (
      !isValid ||
      !doesPasswordMeetCriteria() ||
      !doPasswordsMatch() ||
      password === '' ||
      passwordConfirmation === ''
    );
};

const displaySuccessMessage = () => {
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 5000);
  };


  const onSubmit = async (data) => {
    console.log('onSubmit called with data:', data);
    const response = await fetch(`${ENDPOINT}/user/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        country: data.country,
        state: "string", // substitua "string" pela variável correspondente
      }),
    });

    if (response.status === 200 || response.status === 201) {
      displaySuccessMessage();
      setTimeout(() => {
        navigation.navigate('Login');
      }, 5000);
    } else {
      let responseData = {};
      if (response.headers.get('content-type').includes('application/json')) {
        responseData = await response.json();
      }
      // Trate erros aqui, caso necessário
      console.error('Error:', responseData);
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Create a BRLA account</Text>
        <Text style={styles.subtitle}>
          Design your own payments, payouts and account experiences with access
          to the leading stablecoins and our fully programmable APIs.
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Legal first name"
          onChangeText={(text) => setValue('firstName', text)}
          
        />
        <TextInput
          style={styles.input}
          placeholder="Legal last name"
          onChangeText={(text) => setValue('lastName', text)}
          
        />
        <TextInput
          style={styles.input}
          placeholder="Country"
          onChangeText={(text) => setValue('country', text)}
          
        />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          keyboardType="email-address"
          onChangeText={(text) => setValue('email', text)}
         
        />
      <TextInput
  style={styles.input}
  placeholder="Password"
  secureTextEntry
  onChangeText={(text) => {
    setValue('password', text);
    onPasswordChange(text);
  }}
 
/>
<TextInput
  style={styles.input}
  placeholder="Confirm password"
  secureTextEntry
  onChangeText={(text) => {
    setValue('confirmPassword', text);
    onPasswordConfirmationChange(text);
  }}
  
/>
{(!doPasswordsMatch() && passwordConfirmation.length > 0) && (
      <Text style={styles.passwordMismatchMessage}>
        Passwords do not match.
      </Text>
    )}
<View
  style={[
    styles.passwordStrengthBar,
    { backgroundColor: getPasswordStrengthColor() },
  ]}
/>
        <Text style={styles.passwordRequirements}>
          The password must have at least 8 characters, including at least one
          uppercase letter, one lowercase letter, one number, and one special
          character.
        </Text>
        <TouchableOpacity
  style={[
    styles.button,
    isButtonDisabled() ? styles.buttonDisabled : null,
  ]}
  onPress={handleSubmit(onSubmit)}
  disabled={isButtonDisabled()}
>
  <Text style={styles.buttonText}>SIGN UP</Text>
</TouchableOpacity>


        {showSuccessMessage && (
          <View style={styles.successMessageContainer}>
            <Text style={styles.successMessage}>
              Account created successfully. Please check your email for instructions.
            </Text>
          </View>
        )}
        <Text style={styles.disclaimer}>
          By submitting this form, you agree to the Terms of Service.
          {'\n'}
          By submitting this form, you agree to receive marketing and other
          communications from BRLA about the BRLA Products and other company
          updates. You can unsubscribe from these communications at any time.
          For more information on our privacy practices, please review our
          Privacy Policy.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 20,
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#777',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  button: {
    width: '100%',
    backgroundColor: '#008884',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
    opacity: 1,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    opacity: 1,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  passwordStrengthBar: {
    width: '100%',
    height: 5,
    backgroundColor: '#ccc',
    marginBottom: 10,
  },
  passwordRequirements: {
    fontSize: 14,
    color: '#777',
    marginBottom: 20,
  },
  disclaimer: {
    fontSize: 12,
    color: '#777',
    textAlign: 'justify',
    marginBottom: 30,
  },

  successMessageContainer: {
    backgroundColor: 'rgba(0, 128, 0, 0.8)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  successMessage: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },

  passwordMismatchMessage: {
    color: 'red', // Add the red color here
    fontSize: 14,
    marginBottom: 10,
  },


});

export default SignUp;