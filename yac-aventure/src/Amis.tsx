import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function Amis() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const { token } = route.params;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://192.168.1.20:3001/utilisateurs', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs :', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la récupération des utilisateurs');
    }
  };

  const handleAddFriend = async (userId) => {
    try {
      // Ajouter un ami
      await axios.post('http://192.168.1.20:3001/ajouterAmi', {
        userId: userId,
        // Ajoutez ici l'ID de l'utilisateur connecté
        userIdDemandeur: (route.params as { userIdDemandeur: string }).userIdDemandeur,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Enregistrer la demande d'ami dans la base de données
      await axios.post('http://192.168.1.20:3001/demandeAmi', {
        utilisateur_demandeur_id: (route.params as { userIdDemandeur: string }).userIdDemandeur,
        utilisateur_receveur_id: userId,
        etat: 'en_attente',
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Augmenter le nombre de notifications pour l'utilisateur qui reçoit la demande
      await axios.post('http://192.168.1.20:3001/incrementerNotification', {
        userId: userId,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Rafraîchir la liste des utilisateurs après l'ajout de l'ami
      fetchUsers();
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'ami :', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'ajout de l\'ami');
    }
  };

  const filteredUsers = users.filter((user) =>
    user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderUserItem = ({ item }) => (
    <View style={styles.userContainer}>
      <Text>{item.prenom} {item.nom}</Text>
      <TouchableOpacity onPress={() => handleAddFriend(item.id)}>
        <Text style={styles.addButton}>Ajouter</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Rechercher par prénom ou nom"
        value={searchTerm}
        onChangeText={setSearchTerm}
        style={styles.searchInput}
      />
      <FlatList
        data={filteredUsers}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  searchInput: {
    width: '90%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
  userContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    width: '90%',
  },
  addButton: {
    color: 'blue',
    fontWeight: 'bold',
  },
});
