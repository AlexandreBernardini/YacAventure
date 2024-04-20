import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Home from './Home';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Profile from './Profile';
import Accueil from './Accueil';
import Tournoi from './Tournoi';
import Chat from './Chat';
import Amis from './Amis';

type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  Accueil: undefined;
  Tournoi: undefined;
  Chat: undefined;
  Amis: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

export function App() {
  return (
      <NavigationContainer>
        <RootStack.Navigator>
          <RootStack.Screen name="Home" component={Home} />
          <RootStack.Screen name="Profile" component={Profile} />
          <RootStack.Screen name="Accueil" component={Accueil} />
          <RootStack.Screen name="Tournoi" component={Tournoi} />
          <RootStack.Screen name="Chat" component={Chat} />
          <RootStack.Screen name="Amis" component={Amis} />
        </RootStack.Navigator>
      </NavigationContainer>
  );
}