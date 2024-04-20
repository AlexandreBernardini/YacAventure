import React, { useState, useEffect } from 'react';
import { Text, View, Button, FlatList, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import axios from 'axios';

export default function Amis() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://192.168.1.20:3000/utilisateurs');
      setUsers(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs :', error);
      // Gérer l'erreur
    }
  };

  const handleAddFriend = (userId) => {
    // Logique pour ajouter un ami
  };

const filteredUsers = users.filter((user: { prenom: string, nom: string }) =>
    user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.nom.toLowerCase().includes(searchTerm.toLowerCase())
);

const renderUserItem = ({ item }: { item: { id: number, prenom: string, nom: string } }) => (
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
  },
  addButton: {
    color: 'blue',
    fontWeight: 'bold',
  },
});
