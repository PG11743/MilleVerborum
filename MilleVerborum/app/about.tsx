
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import MaskedView from '@react-native-masked-view/masked-view';

export default function About() {
    return (
        <View style={styles.container} >
            <LinearGradient
                colors={['#7700ffff', '#00f9ff']}
                style={StyleSheet.absoluteFill}
            />
            <StatusBar backgroundColor="#00f9ff" />
            <Text style={styles.accuracyText}>
                Mille Verba is a hobby project, and should be viewed as such. While we strive for linguistic accuracy, we cannot guarantee that all translations or flashcards are error-free. This app is intended as a study aid, not a definitive primary source. Use at your own discretion.
            </Text>
            <Text style={styles.privacyText}>
                We do not collect, store, or share any user data. All progress is stored locally on your device. Updates may erase progress.
            </Text>
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
    accuracyText:     {
        color: '#ffffffff',
        fontSize: 15,
        marginHorizontal: 20
    },
    privacyText: {
        color: '#ffffffff',
        fontSize: 15,
        marginHorizontal: 20,
        marginTop: 20
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: 300
    }
});