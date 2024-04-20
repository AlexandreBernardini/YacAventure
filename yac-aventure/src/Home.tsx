import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
export default function Home() {

const navigation = useNavigation();

    return (
        <View style={styles.container}>
        <Text style={styles.title}>Bienvenue à Yac Aventure!</Text>
        <Text style={styles.subtitle}>Commencez par vous connecter</Text>
        <Button title="Start" onPress={() => navigation.navigate('Profile' as never)} />
        </View>
    );
    }
    const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 18,
        color: 'gray',
    },
    });