import { Text, View, Button, Alert, TextInput } from 'react-native';
import { useState } from 'react';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const Profile: React.FC = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [age, setAge] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();
  
    const handleSignUp = async () => {
      try {
        // Validation des champs
        if (!firstName || !lastName || !age || !password) {
          Alert.alert('Erreur', 'Veuillez remplir tous les champs');
          return;
        }
            
        // Envoi des données d'inscription au backend
        const response = await axios.post('http://192.168.1.20:3000/inscription', {
          prenom: firstName as string,
          nom: lastName as string,
          age: parseInt(age),
          mot_de_passe: password as string,
        });
    
        console.log(response.data.message);
        // Réinitialisation des champs après inscription réussie
        setFirstName('');
        setLastName('');
        setAge('');
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
        if (!firstName || !lastName || !password) {
          Alert.alert('Erreur', 'Veuillez remplir tous les champs');
          return;
        }
  
        // Envoi des données de connexion au backend
        const response = await axios.post('http://192.168.1.20:3000/connexion', {
          prenom: firstName,
          nom: lastName,
          mot_de_passe: password,
        });

        if (response.data.success) {
          // Si la connexion réussit, naviguer vers la page d'accueil
          navigation.navigate('Accueil', { firstName, lastName });
        } else {
          Alert.alert('Erreur', 'Nom, prénom ou mot de passe incorrect');
        }
      } catch (error) {
        console.error('Erreur lors de la connexion :', error);
        Alert.alert('Erreur', 'Une erreur est survenue lors de la connexion');
      }
    };
  
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TextInput
          placeholder="Prénom"
          value={firstName}
          onChangeText={setFirstName}
          style={{ marginBottom: 10 }}
        />
        <TextInput
          placeholder="Nom"
          value={lastName}
          onChangeText={setLastName}
          style={{ marginBottom: 10 }}
        />
        <TextInput
          placeholder="Âge"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
          style={{ marginBottom: 10 }}
        />
        <TextInput
          placeholder="Mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={{ marginBottom: 10 }}
        />
        <Button title="S'inscrire" onPress={handleSignUp} />
        
      <View>
        <TextInput
          placeholder="Prénom"
          value={firstName}
          onChangeText={setFirstName}
          style={{ marginBottom: 10 }}
        />
        <TextInput
          placeholder="Nom"
          value={lastName}
          onChangeText={setLastName}
          style={{ marginBottom: 10 }}
        />
        <TextInput
          placeholder="Mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={{ marginBottom: 10 }}
        />
        <Button title="Se connecter" onPress={handleSignIn} />
      </View>
      </View>
    );
  };

  export default Profile;
