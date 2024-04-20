import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

export default function Accueil({ route }: { route: any }) {
    const { firstName, lastName } = route.params;
    const navigation = useNavigation();
    const [notificationCount, setNotificationCount] = useState(0);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            console.log(firstName, lastName);
            const response = await axios.get('http://192.168.1.20:3000/utilisateursNotif', {
                params: {
                    prenom: firstName,
                    nom: lastName
                }
            });
            setNotificationCount(response.data.notification);
            console.log(notificationCount);
        } catch (error) {
            console.error('Erreur lors de la récupération du nombre de notifications :', error);
            // Gérer l'erreur
        }
    };

    const handleNavigation = (screenName: string) => {
        navigation.navigate(screenName as never);
    };

    return (
        <View>
            <View style={styles.headerProfile}>
                <Text style={styles.headerProfileText}>{firstName} {lastName}</Text>
                <TouchableOpacity onPress={() => handleNavigation('Notification')}>
                    <Text>Notification : {notificationCount}</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.container}>
                <TouchableOpacity style={styles.card} onPress={() => handleNavigation('Tournoi')}>
                    <Text style={styles.cardText}>Tournoi</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.card} onPress={() => handleNavigation('Chat')}>
                    <Text style={styles.cardText}>Chat</Text>
                </TouchableOpacity>
            </View>
            <View>
                <TouchableOpacity style={styles.cardAmis} onPress={() => handleNavigation('Amis')}>
                    <Text style={styles.cardText}>Amis</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
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
        backgroundColor: 'green',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
        marginRight: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'gray',
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
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
