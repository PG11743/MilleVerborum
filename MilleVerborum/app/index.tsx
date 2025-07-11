
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Index() {



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