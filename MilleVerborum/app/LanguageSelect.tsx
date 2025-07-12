import LanguageListItem from '@/components/LanguageListItem';
import { openLanguageDatabase } from '@/db/openDatabase';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import LottieView from 'lottie-react-native';
import { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';


// This won't really do anything but show the dev what the types should be, since TypeScript can't tell at compile time whether this is correct.
type LangRowType = {
    lang_id: number;
    lang_name: string;
};

type Props = {
    isModalVisible: boolean;
    setModalVisibility: React.Dispatch<React.SetStateAction<boolean>>;
}

async function getActiveLanguages(setLanguages: Function, setLoading: Function) {
    try {
        const db = await openLanguageDatabase();
        const result = await db.getAllAsync("SELECT lang_id, lang_name FROM languages;");
        setLanguages(result);
        setLoading(false);
    } catch (error) {
        console.error("DB failed to open", error);
    }
};

export default function LanguageSelect({isModalVisible, setModalVisibility} : Props) {

    const [languages, setLanguages] = useState<LangRowType[]>([]);
    const [loading, setLoading] = useState<Boolean>(true);

    useEffect(() => {
        (async () => {
            getActiveLanguages(setLanguages, setLoading);
        })();
    }, []);

    return (
        <Modal
        animationType="slide"
        visible={isModalVisible}
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
                            <Text style={styles.modalTitle}>Select a language</Text>
                            <MaterialIcons
                                name="close"
                                size={22}
                                color="#25292e"
                                onPress={() => setModalVisibility(false)}
                                style={styles.closeIcon}
                            />
                        </View>
                        <ScrollView style={styles.scrollView}>
                            {languages.map((item) => (
                                <LanguageListItem
                                    key={item.lang_id}
                                    item={{ id: item.lang_id, title: item.lang_name }}
                                    activeOnly={false}
                                    setModalVisibility={setModalVisibility}
                                />
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
        alignItems: 'center',
        justifyContent: 'center',
    },
});
