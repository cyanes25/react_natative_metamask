import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { ENDPOINT} from '../variaveis';
const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigation = useNavigation();
  
  const onSubmit = async () => {
    const response = await fetch(`${ENDPOINT}/user/changepassword`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currentPassword: currentPassword,
        newPassword: newPassword,
        newPasswordConfirm: confirmPassword,
      }),
    });

    if (response.status === 200 || response.status === 201) {
        Toast.show({
            type: 'success',
            text1: 'Password successfully changed',
          });
      setTimeout(() => {
        navigation.navigate('Login');
      }, 5000);
    } else {
      let responseData = {};
      if (response.headers.get('content-type').includes('application/json')) {
        responseData = await response.json();
      }
      Toast.show({
        type: 'error',
        text1: responseData,
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Change password</Text>
      <Text style={styles.subtitle}>
        The password must have at least 8 characters, including at least one
        uppercase letter, one lowercase letter, one number, and one special
        character.
      </Text>
      <View style={styles.whiteBox}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Current password"
            secureTextEntry={!showCurrentPassword}
            onChangeText={(text) => setCurrentPassword(text)}
            value={currentPassword}
          />
          <TouchableOpacity
            onPress={() => setShowCurrentPassword(!showCurrentPassword)}
            style={styles.showPasswordIcon}
          >
           
           <Image
  style={styles.eyeIcon}
  source={showCurrentPassword ? require('./hidden.png') : require('./eye.png')}
/>

          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="New password"
            secureTextEntry={!showNewPassword}
            onChangeText={(text) => setNewPassword(text)}
            value={newPassword}
          />
          <TouchableOpacity
            onPress={() => setShowNewPassword(!showNewPassword)}
            style={styles.showPasswordIcon}
          >
                <Image
  style={styles.eyeIcon}
  source={showCurrentPassword ? require('./hidden.png') : require('./eye.png')}
/>
         </TouchableOpacity>
       </View>
       <View style={styles.inputContainer}>
         <TextInput
           style={styles.input}
           placeholder="Re-type new password"
           secureTextEntry={!showConfirmPassword}
           onChangeText={(text) => setConfirmPassword(text)}
           value={confirmPassword}
         />
         <TouchableOpacity
           onPress={() => setShowConfirmPassword(!showConfirmPassword)}
           style={styles.showPasswordIcon}
         >
               <Image
  style={styles.eyeIcon}
  source={showCurrentPassword ? require('./hidden.png') : require('./eye.png')}
/>
         </TouchableOpacity>
       </View>
       <View style={styles.buttonContainer}>
         <TouchableOpacity
           style={styles.changePasswordButton}
           onPress={onSubmit}
         >
           <Text style={styles.buttonText}>Change Password</Text>
         </TouchableOpacity>
         <TouchableOpacity
           style={styles.cancelButton}
           onPress={() => navigation.navigate('Profile')}
         >
           <Text style={styles.cancelButtonText}>Cancel</Text>
         </TouchableOpacity>
       </View>
     </View>
   </ScrollView>
     );
   };
   
   const styles = StyleSheet.create({
     container: {
       flex: 1,
       backgroundColor: '#f5f5f5',
       padding: 16,
     },
     title: {
       fontSize: 24,
       fontWeight: 'bold',
       color: '#000',
       marginBottom: 8,
     },
     subtitle: {
       fontSize: 14,
       color: '#808080',
       marginBottom: 24,
     },
     whiteBox: {
       backgroundColor: 'white',
       borderRadius: 12,
       paddingHorizontal: 20,
       paddingVertical: 16,
     },
     inputContainer: {
       flexDirection: 'row',
       alignItems: 'center',
       marginBottom: 16,
     },
     input: {
       flex: 1,
       borderBottomWidth: 1,
       borderBottomColor: '#808080',
       fontSize: 16,
       marginRight: 8,
     },
     showPasswordIcon: {
       marginLeft: 8,
     },
     buttonContainer: {
       flexDirection: 'row',
       justifyContent: 'space-between',
       marginTop: 24,
     },
     changePasswordButton: {
       backgroundColor: '#008884',
       paddingHorizontal: 16,
       paddingVertical: 12,
       borderRadius: 4,
     },
     cancelButton: {
       backgroundColor: 'white',
       paddingHorizontal: 16,
       paddingVertical: 12,
       borderRadius: 4,
       borderWidth: 1,
       borderColor: '#00dc84',
     },
     buttonText: {
       color: 'white',
       fontSize: 16,
     },
     cancelButtonText: {
       color: '#00dc84',
       fontSize: 16,
     },
     eyeIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
      },
   });
   
   export default ChangePassword;
   