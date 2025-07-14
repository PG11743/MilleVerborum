import LanguageListItem from '@/components/LanguageListItem';
import { openLanguageDatabase } from '@/db/openDatabase';
import { LangRowType } from '@/types';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import LottieView from 'lottie-react-native';
import { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

type Props = {
    isModalVisible: boolean;
    setModalVisibility: React.Dispatch<React.SetStateAction<boolean>>;
}

async function getInactiveLanguages(setLanguages: Function, setLoading: Function) {
    try {
        const db = await openLanguageDatabase();
        const result = await db.getAllAsync("SELECT lang_id, lang_name FROM languages WHERE curr_level IS NULL;");
        setLanguages(result);
        setLoading(false);
    } catch (error) {
        console.error("DB failed to open", error);
    }
};

export default function LanguageSelect(props : Props) {

    const [languages, setLanguages] = useState<LangRowType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (props.isModalVisible) {
            (async () => {
                getInactiveLanguages(setLanguages, setLoading);
            })();
        }
    }, [props.isModalVisible]);

    return (
        <Modal
            animationType="slide"
            visible={props.isModalVisible}
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
                                onPress={() => props.setModalVisibility(false)}
                                style={styles.closeIcon}
                            />
                        </View>
                        <ScrollView style={styles.scrollView}>
                            {languages.map((item) => (
                                <LanguageListItem
                                    key={item.lang_id}
                                    item={{ lang_id: item.lang_id, lang_name: item.lang_name }}
                                    activeOnly={false}
                                    setModalVisibility={props.setModalVisibility}
                                    setInactiveLoading={setLoading}
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
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
