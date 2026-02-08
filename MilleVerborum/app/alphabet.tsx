import LanguageListItem from '@/components/LanguageListItem';
import { openLanguageDatabase } from '@/db/openDatabase';
import { LangRowType } from '@/types';
import { LetterRowType } from '@/types';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import LottieView from 'lottie-react-native';
import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AlphabetListItem from '@/components/AlphabetListItem';

type Props = {
    isAlphabetVisible: boolean;
    setAlphabetVisibility: React.Dispatch<React.SetStateAction<boolean>>;
    langId:    number;
}

async function getInactiveletters(setLetters: Function, setLoading: Function) {
    try {
        const db = await openLanguageDatabase();
        const result = await db.getAllAsync("SELECT lang_id, lang_name FROM letters WHERE curr_level IS NULL;");
        setLetters(result);
        setLoading(false);
    } catch (error) {
        console.error("DB failed to open", error);
    }
};

async function getLetters(setLetters: Function, setLoading: Function, lang_id:  number) {
    try {
        const db = await openLanguageDatabase();
        const result = await db.getAllAsync("SELECT letter_id, letter_symbol, pronunciation, explanation FROM alphabet WHERE lang_id = ?;", [lang_id]);
        setLetters(result);
        setLoading(false);
    } catch (error) {
        console.error("DB failed to open", error);
    }

};
export default function Alphabet(props : Props) {

    const [letters, setLetters] = useState<LetterRowType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (props.isAlphabetVisible) {
            (async () => {
                getLetters(setLetters, setLoading, props.langId);
            })();
        }
    }, [props.isAlphabetVisible]);

    return (
        <Modal
            animationType="slide"
            visible={props.isAlphabetVisible}
            transparent={true} // Make background see-through
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                {loading ? (
                    <View style={styles.centered}>
                    <LottieView
                        source={require('@/assets/animations/loading.json')}
                        autoPlay
                        loop
                        style={{ width: 150, height: 150 }}
                    />
                    </View>
                ) : (
                    <View style={styles.modalContentContainer}>
                        <View style={styles.modalTitleContainer}>
                            <Text style={styles.modalTitle}>Alphabet</Text>
                            <MaterialIcons
                                name="close"
                                size={22}
                                color="#25292e"
                                onPress={() => props.setAlphabetVisibility(false)}
                                style={styles.closeIcon}
                            />
                        </View>
                        <ScrollView style={styles.scrollView}>
                            {letters.map((item) => (
                                <AlphabetListItem key={item.letter_id} letterSymbol={item.letter_symbol} pronunciation={item.pronunciation} explanation={item.explanation}/>
                            ))}
                        </ScrollView>
                    </View>
                )}
                </View>
            </View>
        </Modal>
        );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        height: '90%',
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        elevation: 5, // Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    modalTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        marginBottom: 10,

    },

    modalTitle: {
        fontSize: 20,
        flex: 1,
        textAlign: 'center',
        marginLeft: 22, // Add space to account for the icon width on the right
    },
    closeIcon: {
        
    },
    modalContentContainer: {
        flex: 1
    },
    scrollView: {
        flex: 1
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
