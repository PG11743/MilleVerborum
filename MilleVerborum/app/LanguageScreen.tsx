import LanguageListItem from '@/components/LanguageListItem';
import { openLanguageDatabase } from '@/db/openDatabase';
import { LangRowType } from '@/types';
import LottieView from 'lottie-react-native';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView, Pressable, ScrollView } from 'react-native-gesture-handler';
import LanguageSelect from './LanguageSelect';


async function getActiveLanguages (setActiveLanguages : Function, setActiveLoading : Function) {
    try{
        const db = await openLanguageDatabase();
        const result = await db.getAllAsync("SELECT lang_id, lang_name FROM languages where curr_level IS NOT NULL;");
        setActiveLanguages(result);
        setActiveLoading(false);
    } catch (error) {
        console.error("DB failed to open", error);
    }    
};

export default function LanguageScreen() {

    const [languages, setLanguages] = useState<LangRowType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalVisible, setModalVisibility] = useState<boolean>(false);

    useEffect(() => {
        if (!isModalVisible) {
            (async () => {
                getActiveLanguages(setLanguages, setLoading);
            })();
        }
    }, [isModalVisible, loading]);

    return (
        <GestureHandlerRootView>
            {loading ? (
                <View style={styles.loadingBox}>
                    <LottieView
                        source={require('@/assets/animations/loading.json')}
                        autoPlay
                        loop={true}
                        style={{ width: 150, height: 150 }}
                    />                
                </View>
            ) : (
                <View>
                    <ScrollView>
                        {
                            languages.map((item) => (
                                <LanguageListItem key={item.lang_id} item={{lang_id: item.lang_id, lang_name: item.lang_name}} setActiveLoading={setLoading} activeOnly={true}/>
                            ))
                        }
                    </ScrollView>
                    <Pressable style={styles.modalBox} onPress={
                        () =>{
                            console.log('opening modal...');
                            setModalVisibility(true);
                        }}
                    >
                        <View style={styles.modalButton}>
                            <Text>Add language</Text>
                        </View>
                    </Pressable>
                </View>
            )}
            <LanguageSelect
                isModalVisible={isModalVisible}
                setModalVisibility={setModalVisibility}
            />
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    loadingBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalButton: {
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 30,
        paddingRight: 30,
        marginTop: 30,
        marginBottom: 30,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 20
    },
    modalBox: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30
    },
    modalButtonText: {
        fontSize: 20
    }
});