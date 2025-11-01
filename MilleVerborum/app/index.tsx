
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import MaskedView from '@react-native-masked-view/masked-view';

export default function Index() {
    return (
        <View style={styles.container} >
            <LinearGradient
                colors={['#7700ffff', '#00f9ff']}
                style={StyleSheet.absoluteFill}
            />
            <StatusBar backgroundColor="#00f9ff" />
            <Link href="/LanguageScreen" asChild>
                <Pressable style={styles.button}>
                    <MaskedView
                    style={{ flex: 1, flexDirection: 'row', height: '100%' }}
                    maskElement={
                        <View
                            style={{
                                // Transparent background because mask is based off alpha channel.
                                backgroundColor: 'transparent',
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <View
                                style={{flexDirection: 'row'}}
                            >
                                <FontAwesome name="arrow-right" size={30} style={styles.buttonIcon} />
                                <Text style={styles.buttonLabel}>Start</Text>
                            </View>
                        </View>
                    }
                    >
                        {/* Shows behind the mask, you can put anything here, such as an image */}
                        <LinearGradient
                            colors={['#00f9ff', '#7700ffff']}
                            style={StyleSheet.absoluteFill}
                        />
                    </MaskedView>
                </Pressable>
            </Link>
            <Link href="/" asChild>
                <Pressable style={styles.button}>
                    <MaskedView
                    style={{ flex: 1, flexDirection: 'row', height: '100%' }}
                    maskElement={
                        <View
                            style={{
                                // Transparent background because mask is based off alpha channel.
                                backgroundColor: 'transparent',
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <View
                                style={{flexDirection: 'row'}}
                            >
                                <FontAwesome name="bar-chart" size={30} style={styles.buttonIcon} />
                                <Text style={styles.buttonLabel}>Stats</Text>
                            </View>
                        </View>
                    }
                    >
                        {/* Shows behind the mask, you can put anything here, such as an image */}
                        <LinearGradient
                            colors={['#00f9ff', '#7700ffff']}
                            style={StyleSheet.absoluteFill}
                        />
                    </MaskedView>
                </Pressable>
            </Link>
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
        minHeight: 75,
        maxWidth: 200
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