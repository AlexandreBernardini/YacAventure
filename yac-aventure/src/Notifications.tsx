import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useEffect, useState } from 'react';
export default function Notifications({ route }: { route: any }) {

    const { pseudo } = route.params;
  return (
    <View>
            <View style={styles.headerProfile}>
                <Text style={styles.headerProfileText}>{pseudo}</Text>
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
}); 
