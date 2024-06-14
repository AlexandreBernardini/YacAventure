import { Text, View, Button, Alert, TextInput, StyleSheet, Image } from 'react-native';
import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

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
      // Validation des champs
      if (!firstName || !lastName || !age || !password || !email || !pseudo) {
        Alert.alert('Erreur', 'Veuillez remplir tous les champs');
        return;
      }

      // Envoi des données d'inscription au backend
      const response = await axios.post('http://192.168.1.20:3001/inscription', {
        prenom: firstName as string,
        nom: lastName as string,
        mot_de_passe: password as string,
        email: email as string,
        pseudo: pseudo as string,
        age: parseInt(age)
      });

      console.log(response.data.message);
      // Réinitialisation des champs après inscription réussie
      setFirstName('');
      setLastName('');
      setAge('');
      setEmail('');
      setPseudo('');
      setPassword('');

      // Autres actions après l'inscription
    } catch (error) {
      console.error('Erreur lors de l\'inscription :', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'inscription');
    }
  };

  const handleSignIn = async () => {
  try {
    // Validation des champs
    if (!pseudo || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    // Envoi des données de connexion au backend
    const response = await axios.post('http://192.168.1.20:3001/connexion', {
      pseudo: pseudo as string,
      mot_de_passe: password as string,
    });

    if (response.data.success) {
      // Si la connexion réussit, naviguer vers la page d'accueil avec le token
      const token = response.data.token; // Assurez-vous de récupérer le token de la réponse
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
    setIsSigningUp(!isSigningUp); // Inverser l'état de l'inscription/connexion
    // Réinitialiser les champs lorsque vous basculez entre les formulaires
    setFirstName('');
    setLastName('');
    setAge('');
    setEmail('');
    setPseudo('');
    setPassword('');
  };

  return (
    <View>
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue à Yac Aventure!</Text>
      <Text style={styles.subtitle}>Commencez par vous {isSigningUp ? 'inscrire' : 'connecter'}</Text>
    </View>
    {isSigningUp && (
      <>
        <TextInput
          placeholder="Prénom"
          value={firstName}
          onChangeText={setFirstName}
          style={styles.TextInput}
        />
        <TextInput
          placeholder="Nom"
          value={lastName}
          onChangeText={setLastName}
          style={styles.TextInput}
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.TextInput}
        />
        <TextInput
          placeholder="Pseudo"
          value={pseudo}
          onChangeText={setPseudo}
          style={styles.TextInput}
        />
        <TextInput
          placeholder="Mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.TextInput}
        />
        <TextInput
          placeholder="Âge"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
          style={styles.TextInput}
        />
        <Button title="S'inscrire" onPress={handleSignUp} />
      </>
    )}
    {!isSigningUp && (
      <>
        <TextInput
          placeholder="Pseudo"
          value={pseudo}
          onChangeText={setPseudo}
          style={styles.TextInput}
        />
        <TextInput
          placeholder="Mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.TextInput}
        />
        <Button title="Se connecter" onPress={handleSignIn} />
      </>
    )}
    <View style={styles.Button}>
    <Button title={isSigningUp ? "Se connecter" : "S'inscrire"} onPress={toggleForm} />
    </View>      
  <Image source={require('../image/logo-yacavantures.png')} style={styles.image} />
  </View>
  );
};
const styles = StyleSheet.create({
  image: {
      marginLeft: 25,
      marginTop: 10,
  },
  container: {
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 30,
  },
  title: {
      fontSize: 24,
      fontWeight: 'bold',
  },
  subtitle: {
      fontSize: 18,
      color: 'gray',
  },
  TextInput: {
    height: 40,
    borderColor: 'blue',
    borderWidth: 2,
    margin: 10,
    padding: 10,
  },
  Button: {
    marginTop: 10,
  },
  });
export default Login;
