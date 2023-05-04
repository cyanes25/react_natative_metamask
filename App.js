import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './src/Home/Home';
import Banks from './src/Banks/Banks';
import Wallets from './src/Wallets/Wallets';
import Deposit from './src/Mint/Mint';
import Withdraw from './src/Burn/Burn';
import Profile from './src/Profile/Profile';
import Limits from './src/Limits/Limits';
import 'react-native-gesture-handler';
import DelayedWithdrawals from './src/DelayedWithdrawals/DelayedWithdrawals';
import Login from './src/Login/Login';
import AddWallet from './src/AddWallet/AddWallet';
import ChooseBank from './src/ChooseBank/ChooseBank';
import BankInformation from './src/BankInformation/BankInformation'; // Importe o componente
import Toast from 'react-native-toast-message';
import SignUp from './src/SignUp/SignUp';
import ForgotPassword from './src/ForgotPassword/ForgotPassword';
import ChangePassword from './src/ChangePassword/ChangePassword';
import { Image } from 'react-native';
import homeIcon from './src/Icons/house.png';
import banksIcon from './src/Icons/bank.png';
import walletsIcon from './src/Icons/wallet.png';
import depositIcon from './src/Icons/deposit.png';
import withdrawIcon from './src/Icons/withdraw.png';
const Tab = createBottomTabNavigator();
const HomeStackNavigator = createStackNavigator();
const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <HomeStackNavigator.Navigator screenOptions={{ headerShown: false }}>
      <HomeStackNavigator.Screen
        name="Home"
        component={Home}
        options={({ navigation }) => ({ navigation })}
      />
      <HomeStackNavigator.Screen name="Profile" component={Profile} />
      <HomeStackNavigator.Screen name="ChangePassword" component={ChangePassword} />
      <HomeStackNavigator.Screen name="Limits" component={Limits} />
      <HomeStackNavigator.Screen name="DelayedWithdrawals" component={DelayedWithdrawals} />
      <HomeStackNavigator.Screen name="AddWallet" component={AddWallet} />
      <HomeStackNavigator.Screen name="ChooseBank" component={ChooseBank} />
      <HomeStackNavigator.Screen
        name="BankInformation"
        component={BankInformation}
        initialParams={{ bank: { name: 'Other', logo: require('./src/ChooseBank/images/bank.png') } }}
      />
    </HomeStackNavigator.Navigator>
  );
};
const App = () => {
  return (


      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
           <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{ headerShown: false }}
        />
         <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{ headerShown: false }}
        />
          <Stack.Screen
            name="Main"
            component={MainTabs}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
        <Toast ref={(ref) => Toast.setRef(ref)} />
      </NavigationContainer>

  );
};

const MainTabs = () => {
  return (
      <Tab.Navigator tabBarOptions={{ tabBarActiveTintColor: '#08383f' }}>
  
       <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Image
              source={homeIcon}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? '#08383f' : 'gray',
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Banks"
        component={Banks}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Image
              source={banksIcon}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? '#08383f' : 'gray',
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Wallets"
        component={Wallets}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Image
              source={walletsIcon}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? '#08383f' : 'gray',
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Deposit"
        component={Deposit}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Image
              source={depositIcon}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? '#08383f' : 'gray',
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Withdraw"
        component={Withdraw}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Image
              source={withdrawIcon}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? '#08383f' : 'gray',
              }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default App;
