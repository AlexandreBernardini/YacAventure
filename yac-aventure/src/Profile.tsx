import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Alert, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'react-native-image-picker';

export default function Profile({ route, navigation }) {
    const { token, userId } = route.params; // On récupère le token et userId à partir des paramètres de la route
    const [userData, setUserData] = useState(null);
    const [profileImage, setProfileImage] = useState(null);

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const response = await axios.get('http://192.168.1.20:4280/utilisateur', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUserData(response.data);
            if (response.data.profile_image) {
                setProfileImage({ uri: `http://192.168.1.20:4280${response.data.profile_image}` });
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des données du profil :', error);
            Alert.alert('Erreur', 'Une erreur est survenue lors de la récupération des données du profil');
        }
    };

    const selectImage = () => {
        const options = {
            mediaType: 'photo',
            includeBase64: false,
        };
        ImagePicker.launchImageLibrary(options, async (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                console.log('ImagePicker Error: ', response.errorCode);
            } else {
                const source = { uri: response.assets[0].uri };
                setProfileImage(source);
                await uploadImage(response.assets[0].uri);
            }
        });
    };

    const uploadImage = async (uri) => {
        const formData = new FormData();
        formData.append('profileImage', {
            uri,
            type: 'image/jpeg',
            name: 'profile.jpg',
        });
        formData.append('userId', userId);

        try {
            const response = await axios.post('http://192.168.1.20:4280/uploadProfileImage', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            Alert.alert('Succès', 'Image de profil mise à jour avec succès');
        } catch (error) {
            console.error('Erreur lors du téléchargement de l\'image :', error);
            Alert.alert('Erreur', 'Une erreur est survenue lors du téléchargement de l\'image');
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
            {profileImage ? (
                <Image source={profileImage} style={styles.profileImage} />
            ) : (
                <View style={styles.placeholderImage}>
                    <Text>Aucune image</Text>
                </View>
            )}
            <TouchableOpacity style={styles.button} onPress={selectImage}>
                <Text style={styles.buttonText}>Changer l'image de profil</Text>
            </TouchableOpacity>
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
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
    },
    placeholderImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        marginBottom: 20,
    },
    buttonText: {
        color: 'white',
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
