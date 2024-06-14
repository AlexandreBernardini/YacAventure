import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Alert } from 'react-native';
import axios from 'axios';

export default function Profile({ route, navigation }) {
    const { token } = route.params; // On récupère le token à partir des paramètres de la route
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const response = await axios.get('http://192.168.1.20:3001/utilisateur', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUserData(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des données du profil :', error);
            Alert.alert('Erreur', 'Une erreur est survenue lors de la récupération des données du profil');
        }
    };

    if (!userData) {
        return (
            <View style={styles.container}>
                <Text>Chargement...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Prénom: <Text style={styles.value}>{userData.prenom}</Text></Text>
            <Text style={styles.label}>Nom: <Text style={styles.value}>{userData.nom}</Text></Text>
            <Text style={styles.label}>Email: <Text style={styles.value}>{userData.email}</Text></Text>
            <Text style={styles.label}>Pseudo: <Text style={styles.value}>{userData.pseudo}</Text></Text>
            <Text style={styles.label}>Âge: <Text style={styles.value}>{userData.age}</Text></Text>
            <Button title="Retour à l'accueil" onPress={() => navigation.navigate('Accueil', { token })} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    value: {
        fontWeight: 'normal',
    },
});
