import { Text, View, Alert, TextInput, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';

const Login: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [pseudo, setPseudo] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const [isSigningUp, setIsSigningUp] = useState(true);

  const handleSignUp = async () => {
    try {
      if (!firstName || !lastName || !age || !password || !email || !pseudo) {
        Alert.alert('Erreur', 'Veuillez remplir tous les champs');
        return;
      }

      const response = await axios.post('http://192.168.1.20:4280/inscription', {
        prenom: firstName,
        nom: lastName,
        mot_de_passe: password,
        email,
        pseudo,
        age: parseInt(age)
      });

      console.log(response.data.message);

      setFirstName('');
      setLastName('');
      setAge('');
      setEmail('');
      setPseudo('');
      setPassword('');
    } catch (error) {
      console.error('Erreur lors de l\'inscription :', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'inscription');
    }
  };

  const handleSignIn = async () => {
    try {
      if (!pseudo || !password) {
        Alert.alert('Erreur', 'Veuillez remplir tous les champs');
        return;
      }

      const response = await axios.post('http://192.168.1.20:4280/connexion', {
        pseudo,
        mot_de_passe: password,
      });

      if (response.data.success) {
        const token = response.data.token;
        navigation.navigate('Accueil', { token });
      } else {
        Alert.alert('Erreur', 'Pseudo ou mot de passe incorrect');
      }
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la connexion');
    }
  };

  const toggleForm = () => {
    setIsSigningUp(!isSigningUp);
    setFirstName('');
    setLastName('');
    setAge('');
    setEmail('');
    setPseudo('');
    setPassword('');
  };

  return (
    <View style={tw`flex-1 w-full justify-center bg-blue-900`}>
      <View style={tw`items-center justify-center mt-8`}>
        <Text style={tw`text-2xl font-bold text-white`}>Bienvenue à Yac Aventure!</Text>
        <Text style={tw`text-lg text-white`}>Commencez par vous {isSigningUp ? 'inscrire' : 'connecter'}</Text>
      </View>
      {isSigningUp && (
        <>
          <TextInput
            placeholder="Prénom"
            value={firstName}
            onChangeText={setFirstName}
            style={tw`h-10 border-2 border-black rounded-lg bg-white text-black w-11/12 mx-4 my-2 px-3`}
            placeholderTextColor="#aaa"
          />
          <TextInput
            placeholder="Nom"
            value={lastName}
            onChangeText={setLastName}
            style={tw`h-10 border-2 border-black rounded-lg bg-white text-black w-11/12 mx-4 my-2 px-3`}
            placeholderTextColor="#aaa"
          />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={tw`h-10 border-2 border-black rounded-lg bg-white text-black w-11/12 mx-4 my-2 px-3`}
            placeholderTextColor="#aaa"
          />
          <TextInput
            placeholder="Pseudo"
            value={pseudo}
            onChangeText={setPseudo}
            style={tw`h-10 border-2 border-black rounded-lg bg-white text-black w-11/12 mx-4 my-2 px-3`}
            placeholderTextColor="#aaa"
          />
          <TextInput
            placeholder="Mot de passe"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={tw`h-10 border-2 border-black rounded-lg bg-white text-black w-11/12 mx-4 my-2 px-3`}
            placeholderTextColor="#aaa"
          />
          <TextInput
            placeholder="Âge"
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
            style={tw`h-10 border-2 border-black rounded-lg bg-white text-black w-11/12 mx-4 my-2 px-3`}
            placeholderTextColor="#aaa"
          />
          <TouchableOpacity
            style={tw`items-center justify-center bg-green-500 p-3 rounded-lg w-11/12 mx-4 mt-4`}
            onPress={handleSignUp}
          >
            <Text style={tw`text-white text-lg`}>S'inscrire</Text>
          </TouchableOpacity>
        </>
      )}
      {!isSigningUp && (
        <>
          <TextInput
            placeholder="Pseudo"
            value={pseudo}
            onChangeText={setPseudo}
            style={tw`h-10 border-2 border-black rounded-lg bg-white text-black w-11/12 mx-4 my-2 px-3`}
            placeholderTextColor="#aaa"
          />
          <TextInput
            placeholder="Mot de passe"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={tw`h-10 border-2 border-black rounded-lg bg-white text-black w-11/12 mx-4 my-2 px-3`}
            placeholderTextColor="#aaa"
          />
          <TouchableOpacity
            style={tw`items-center justify-center bg-green-500 p-3 rounded-lg w-11/12 mx-4 mt-4`}
            onPress={handleSignIn}
          >
            <Text style={tw`text-white text-lg`}>Se connecter</Text>
          </TouchableOpacity>
        </>
      )}
      <TouchableOpacity
        style={tw`items-center justify-center bg-blue-500 p-3 rounded-lg w-11/12 mx-4 mt-4`}
        onPress={toggleForm}
      >
        <Text style={tw`text-white text-lg`}>{isSigningUp ? "Se connecter" : "S'inscrire"}</Text>
      </TouchableOpacity>
      <View style={tw`items-center justify-center mt-4`}>
        <Image source={require('../image/logo-yacavantures.png')} style={tw`w-32 h-32`} />
      </View>
    </View>
  );
};

export default Login;
