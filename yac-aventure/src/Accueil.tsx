import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, ImageBackground, Image, Modal, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

export default function Accueil({ route }) {
  const { token } = route.params; // On récupère le token à partir des paramètres de la route
  const navigation = useNavigation();
  const [pseudo, setPseudo] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchPseudo();
  }, []);

  const fetchPseudo = async () => {
    try {
      // Récupérer le pseudo à partir du token
      const pseudoResponse = await axios.get('http://192.168.1.20:3001/pseudo', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userPseudo = pseudoResponse.data.pseudo;
      setPseudo(userPseudo);
    } catch (error) {
      console.error('Erreur lors de la récupération du pseudo :', error);
      // Gérer l'erreur
    }
  };

  const handleNavigation = (screenName: string) => {
    navigation.navigate(screenName as never, { token });
  };

  const handleLogout = () => {
    // Logique pour la déconnexion
    navigation.navigate('Login'); // Naviguer vers la page de connexion
  };

  return (
    <View>
      <View style={styles.headerProfile}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={styles.headerProfileText}>{pseudo}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => handleNavigation('Tournoi')}>
          <ImageBackground source={require('../image/petanque.jpg')} style={styles.card}>
            <Text style={styles.cardText}>Tournoi</Text>
          </ImageBackground>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => handleNavigation('Chat')}>
          <ImageBackground source={require('../image/discussion.jpg')} style={styles.card}>
            <Text style={styles.cardText}>Chat</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity style={styles.cardAmis} onPress={() => handleNavigation('Amis')}>
          <Text style={styles.cardText}>Amis</Text>
        </TouchableOpacity>
      </View>
      <Image source={require('../image/logo-yacavantures.png')} style={styles.image} />
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          <TouchableOpacity onPress={() => { setModalVisible(!modalVisible); handleNavigation('Profile'); }}>
            <Text style={styles.modalText}>Profil</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setModalVisible(!modalVisible); handleLogout(); }}>
            <Text style={styles.modalText}>Se déconnecter</Text>
          </TouchableOpacity>
          <Button title="Fermer" onPress={() => setModalVisible(!modalVisible)} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    marginLeft: 25,
    marginTop: 10,
  },
  headerProfile: {
    height: 100,
    backgroundColor: 'lightblue',
    justifyContent: 'center',
  },
  headerProfileText: {
    fontSize: 20,
    marginLeft: 10,
  },
  card: {
    width: 160,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    marginRight: 10,
  },
  cardAmis: {
    width: 340,
    height: 100,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    marginRight: 10,
    marginLeft: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'gray',
  },
  cardText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 60,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
  },
});
