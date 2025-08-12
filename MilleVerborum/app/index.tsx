
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { Pressable, StatusBar, StyleSheet, Text, View } from "react-native";

export default function Index() {
    return (
        <View style={styles.container} >
            <LinearGradient
                colors={['#7700ffff', '#00f9ff']}
                style={StyleSheet.absoluteFill}
            />
            <Link href="/LanguageScreen" asChild>
                <Pressable style={styles.button}>
                    <FontAwesome name="arrow-right" size={30} style={styles.buttonIcon} />
                    <Text style={styles.buttonLabel}>Start</Text>
                </Pressable>
            </Link>
            <Link href="/" asChild>
                <Pressable style={styles.button}>
                    <FontAwesome name="bar-chart" size={30} style={styles.buttonIcon} />
                    <Text style={styles.buttonLabel}>Stats</Text>
                </Pressable>
            </Link>
            <StatusBar backgroundColor="#00f9ff" />
        </View>
    );
}

const styles = StyleSheet.create({
    container:  {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3
    },
    button:     {
        borderRadius: 100,
        margin: 10,
        paddingVertical: 10,
        paddingHorizontal: 40,
        backgroundColor: '#ffffffff',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    buttonLabel: {
        fontSize:       30,
        color:          '#000000ff'
    },
    buttonIcon: {
        marginRight: 18,
        color:          '#000000ff'
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: 300
    }
});