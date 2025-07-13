import LanguageListItem from '@/components/LanguageListItem';
import { openLanguageDatabase } from '@/db/openDatabase';
import LottieView from 'lottie-react-native';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView, Pressable, ScrollView } from 'react-native-gesture-handler';
import LanguageSelect from './LanguageSelect';

// This won't really do anything but show the dev what the types should be, since TypeScript can't tell at compile time whether this is correct.
type LangRowType = {
    lang_id     :   number,
    lang_name   :   string
};

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

    const [activeLanguages, setActiveLanguages] = useState<LangRowType[]>([]);
    const [activeLoading, setActiveLoading] = useState<boolean>(true);
    const [isModalVisible, setModalVisibility] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            getActiveLanguages(setActiveLanguages, setActiveLoading);
        })();
    }, []);

    return (
        <GestureHandlerRootView>
            {activeLoading ? (
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
                            activeLanguages.map((item) => (
                                <LanguageListItem key={item.lang_id} item={{id: item.lang_id, title: item.lang_name}} onDelete={(id: number)=>{}} activeOnly={true}/>
                            ))
                        }
                    </ScrollView>
                    <Pressable style={styles.modalBox} onPress={() =>(setModalVisibility(true))}>
                        <View style={styles.modalButton}>
                            <Text>Add language</Text>
                        </View>
                    </Pressable>
                </View>
            )}
            <LanguageSelect
                isModalVisible={isModalVisible}
                setModalVisibility={setModalVisibility}
                getActiveLanguages={getActiveLanguages}
                setActiveLanguages={setActiveLanguages}
                setActiveLoading={setActiveLoading}
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