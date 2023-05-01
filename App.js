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
      <HomeStackNavigator.Screen name="Limits" component={Limits} />
      <HomeStackNavigator.Screen name="DelayedWithdrawals" component={DelayedWithdrawals} />
      <HomeStackNavigator.Screen name="AddWallet" component={AddWallet} />
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
            name="Main"
            component={MainTabs}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>

  );
};

const MainTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Banks"
        component={Banks}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Wallets"
        component={Wallets}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Deposit"
        component={Deposit}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Withdraw"
        component={Withdraw}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

export default App;
