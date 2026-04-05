
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import MaskedView from '@react-native-masked-view/masked-view';
import { openLanguageDatabase } from '@/db/openDatabase';
import { useEffect, useState } from 'react';
import { UserAgreement } from '@/types';
import Terms from './terms';

async function getAgreement (
    setSignedEULA: React.Dispatch<React.SetStateAction<number>>,
    setAgreementPopup: React.Dispatch<React.SetStateAction<boolean>>
) {
    try{
        const db = await openLanguageDatabase();
        const result: UserAgreement | null = await db.getFirstAsync("SELECT COUNT(*) AS counter FROM agreements where type IS 'EULA' AND version IS 1;");
        console.log(result);
        if (result && result?.counter < 1) {
            setSignedEULA(0);
            setAgreementPopup(true);
        } else {
            setSignedEULA(1);
        }
        //setActiveLoading(false);
    } catch (error) {
        console.error("DB failed to open", error);
    }    
};


export default function Index() {
    const [signedEULA, setSignedEULA] = useState<number>(0);
    const [agreementPopup, setAgreementPopup] = useState<boolean>(false);

    useEffect(() => {
        if (signedEULA === 0) {
            getAgreement(setSignedEULA, setAgreementPopup);
        }
    }, []);

    return (
        <View style={styles.container} >
            <LinearGradient
                colors={['#7700ffff', '#00f9ff']}
                style={StyleSheet.absoluteFill}
            />
            <StatusBar backgroundColor="#00f9ff" />
            <View style={styles.modalBox}></View>
            <Terms isModalVisible={agreementPopup} setSignedEULA={setSignedEULA} setModalVisibility={setAgreementPopup} />
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
            <View style={styles.aboutContainer}>
                <Link href="../about" asChild>
                    <Pressable style={styles.aboutButton}>
                        <FontAwesome name="info-circle" size={20} style={styles.aboutButtonIcon} />
                        <Text style={styles.aboutButtonLabel}>About</Text>
                    </Pressable>
                </Link>
            </View>
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
    },
    aboutContainer: {
        position: 'absolute',
        bottom: 60
    },
    aboutButton: {
        alignItems: 'center',
        flexDirection: 'row'
    },
    aboutButtonLabel: {
        fontSize: 20,
        color: '#ffffffff'
    },
    aboutButtonIcon: {
        color: '#ffffffff',
        marginRight: 10
    },
    modalBox: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        backgroundColor: 'blue'
    },
});