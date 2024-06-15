import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function Amis() {
  const [users, setUsers] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]); // Nouvel état pour stocker les amis
  const [searchTerm, setSearchTerm] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const { token, userIdDemandeur } = route.params; // Récupérez token et userIdDemandeur

  useEffect(() => {
    fetchUsers();
    fetchFriendRequests();
    fetchFriends(); // Récupérer les amis
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://192.168.1.20:4280/utilisateurs', {
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

  const fetchFriendRequests = async () => {
    try {
      const response = await axios.get('http://192.168.1.20:4280/demandesAmis', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          utilisateur_receveur_id: userIdDemandeur,
        },
      });
      setFriendRequests(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des demandes d\'amis :', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la récupération des demandes d\'amis');
    }
  };

  const fetchFriends = async () => {
    try {
      const response = await axios.get('http://192.168.1.20:4280/amis', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          utilisateur_id: userIdDemandeur,
        },
      });
      setFriends(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des amis :', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la récupération des amis');
    }
  };

  const handleAddFriend = async (userId) => {
    try {
      // Enregistrer la demande d'ami dans la base de données
      await axios.post('http://192.168.1.20:4280/demandeAmi', {
        utilisateur_demandeur_id: userIdDemandeur, // Utilisez le userIdDemandeur de route.params
        utilisateur_receveur_id: userId,
        etat: 'en_attente',
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Alert.alert('Succès', 'Demande d\'ami envoyée');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'ami :', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'ajout de l\'ami');
    }
  };

  const handleAcceptFriendRequest = async (requestId) => {
    try {
      // Logique pour accepter la demande d'ami (mise à jour de l'état)
      await axios.post(`http://192.168.1.20:4280/accepterAmi`, {
        requestId: requestId,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Alert.alert('Succès', 'Demande d\'ami acceptée');
      fetchFriendRequests();
      fetchFriends(); // Mettre à jour la liste des amis
    } catch (error) {
      console.error('Erreur lors de l\'acceptation de la demande d\'ami :', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'acceptation de la demande d\'ami');
    }
  };

  const handleRejectFriendRequest = async (requestId) => {
    try {
      // Logique pour rejeter la demande d'ami (mise à jour de l'état)
      await axios.post(`http://192.168.1.20:4280/rejeterAmi`, {
        requestId: requestId,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Alert.alert('Succès', 'Demande d\'ami rejetée');
      fetchFriendRequests();
    } catch (error) {
      console.error('Erreur lors du rejet de la demande d\'ami :', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors du rejet de la demande d\'ami');
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

  const renderFriendRequestItem = ({ item }) => (
    <View style={styles.userContainer}>
      <Text>{item.prenom} {item.nom}</Text>
      <View style={styles.requestButtons}>
        <TouchableOpacity onPress={() => handleAcceptFriendRequest(item.id)}>
          <Text style={styles.acceptButton}>Accepter</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleRejectFriendRequest(item.id)}>
          <Text style={styles.rejectButton}>Rejeter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFriendItem = ({ item }) => (
    <View style={styles.userContainer}>
      <Text>{item.prenom} {item.nom}</Text>
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
      <Text style={styles.sectionTitle}>Demandes d'amis reçues</Text>
      <FlatList
        data={friendRequests}
        renderItem={renderFriendRequestItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <Text style={styles.sectionTitle}>Mes amis</Text>
      <FlatList
        data={friends}
        renderItem={renderFriendItem}
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  requestButtons: {
    flexDirection: 'row',
  },
  acceptButton: {
    color: 'green',
    marginRight: 10,
  },
  rejectButton: {
    color: 'red',
  },
});
