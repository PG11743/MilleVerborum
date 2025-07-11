import { openLanguageDatabase } from '@/db/openDatabase';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Index() {

    const [items, setItems] = useState<any[]>([]);

    useEffect(() => {
        // console.log('running useEffect, about to call db');
        (async () => {
            try{
                // console.log('sending async request...');
                const db = await openLanguageDatabase();
                // console.log('opened db, preparing query for languages...');

                const result = await db.getAllAsync("SELECT * FROM languages;");
                console.log('Result:', result); // Should have .rows._array
            } catch (error) {
                console.error("DB failed to open", error);
            }
        })();
    }, []);

    return (
        <View style={styles.container}>
            <Link href="/LanguageScreen" asChild>
                <Pressable style={styles.button}>
                    <FontAwesome name="arrow-right" size={30} color="#25292e" style={styles.buttonIcon} />
                    <Text style={styles.buttonLabel}>Start</Text>
                </Pressable>
            </Link>
            <Link href="/" asChild>
                <Pressable style={styles.button}>
                    <FontAwesome name="bar-chart" size={30} color="#25292e" style={styles.buttonIcon} />
                    <Text style={styles.buttonLabel}>Stats</Text>
                </Pressable>
            </Link>
        </View>
    );
}

const styles = StyleSheet.create({
    container:  {
        flex: 1,
        marginHorizontal: 20,
        marginVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3
    },
    button:     {
        borderRadius: 10,
        margin: 10,
        paddingVertical: 10,
        paddingHorizontal: 40,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderWidth: 1
    },
    buttonLabel: {
        fontSize:       30
    },
    buttonIcon: {
        marginRight: 18,
    },
});