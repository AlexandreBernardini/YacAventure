import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Accueil from './Accueil';
import Tournoi from './Tournoi';
import Chat from './Chat';
import Amis from './Amis';
import Notification from './Notifications';
import Login from './Login';
import Profile from './Profile';

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Accueil: undefined;
  Tournoi: undefined;
  Chat: undefined;
  Amis: undefined;
  Notification: undefined;
  Profile: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

export function App() {
  return (
      <NavigationContainer>
        <RootStack.Navigator >
          <RootStack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <RootStack.Screen name="Accueil" component={Accueil} options={{ headerShown: false }} />
          <RootStack.Screen name="Tournoi" component={Tournoi} />
          <RootStack.Screen name="Chat" component={Chat} />
          <RootStack.Screen name="Amis" component={Amis} />
          <RootStack.Screen name="Notification" component={Notification} />
          <RootStack.Screen name="Profile" component={Profile} />
        </RootStack.Navigator>
      </NavigationContainer>
  );
}