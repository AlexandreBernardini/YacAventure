import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, ImageBackground, Image, Modal, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import tw from 'twrnc';

export default function Accueil({ route }) {
  const { token } = route.params;
  const navigation = useNavigation();
  const [pseudo, setPseudo] = useState('');
  const [userIdDemandeur, setUserIdDemandeur] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchPseudo();
  }, []);

  const fetchPseudo = async () => {
    try {
      const pseudoResponse = await axios.get('http://192.168.1.20:4280/pseudo', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userPseudo = pseudoResponse.data.pseudo;
      const userId = pseudoResponse.data.userId;
      setPseudo(userPseudo);
      setUserIdDemandeur(userId);
    } catch (error) {
      console.error('Erreur lors de la récupération du pseudo :', error);
    }
  };

  const handleNavigation = (screenName) => {
    if (userIdDemandeur !== null) {
      navigation.navigate(screenName, { token, userIdDemandeur });
    } else {
      console.error('Erreur : ID utilisateur non récupéré');
    }
  };

  const handleLogout = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={tw`flex-1 bg-gray-100`}>
      <View style={tw`h-24 bg-blue-600 justify-center px-4`}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={tw`text-2xl text-white font-bold`}>{pseudo}</Text>
        </TouchableOpacity>
      </View>
      <View style={tw`flex-row justify-around mt-6`}>
        <TouchableOpacity onPress={() => handleNavigation('Tournoi')} style={tw`w-40 h-40 bg-white shadow-lg rounded-lg overflow-hidden`}>
          <ImageBackground source={require('../image/petanque.jpg')} style={tw`w-full h-full justify-center items-center`}>
            <Text style={tw`text-xl font-bold text-white bg-black bg-opacity-50 p-2 rounded`}>Tournoi</Text>
          </ImageBackground>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleNavigation('Chat')} style={tw`w-40 h-40 bg-white shadow-lg rounded-lg overflow-hidden`}>
          <ImageBackground source={require('../image/discussion.jpg')} style={tw`w-full h-full justify-center items-center`}>
            <Text style={tw`text-xl font-bold text-white bg-black bg-opacity-50 p-2 rounded`}>Chat</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>
      <View style={tw`mt-6 items-center`}>
        <TouchableOpacity onPress={() => handleNavigation('Amis')} style={tw`w-11/12 h-20 bg-green-500 shadow-lg rounded-lg flex justify-center items-center`}>
          <Text style={tw`text-xl font-bold text-white`}>Amis</Text>
        </TouchableOpacity>
      </View>
      <View style={tw`mt-6 items-center`}>
        <Image source={require('../image/logo-yacavantures.png')} style={tw`w-32 h-32`} />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
          <View style={tw`w-10/12 bg-white rounded-lg p-6 items-center shadow-lg`}>
            <TouchableOpacity onPress={() => { setModalVisible(!modalVisible); handleNavigation('Profile'); }}>
              <Text style={tw`text-lg mb-4`}>Profil</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setModalVisible(!modalVisible); handleLogout(); }}>
              <Text style={tw`text-lg mb-4`}>Se déconnecter</Text>
            </TouchableOpacity>
            <Button title="Fermer" onPress={() => setModalVisible(!modalVisible)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}
