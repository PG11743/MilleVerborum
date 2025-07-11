import ActiveLanguage from '@/components/ActiveLanguage';
import { openLanguageDatabase } from '@/db/openDatabase';
import LottieView from 'lottie-react-native';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';

// This won't really do anything but show the dev what the types should be, since TypeScript can't tell at compile time whether this is correct.
type LangRowType = {
    lang_id     :   number,
    lang_name   :   string
};

async function getActiveLanguages (setLanguages : Function, setLoading : Function) {
       
                try{
                    const db = await openLanguageDatabase();
                    const result = await db.getAllAsync("SELECT lang_id, lang_name FROM languages;");
                    setLanguages(result);
                    setLoading(false);
                } catch (error) {
                    console.error("DB failed to open", error);
                }

    
};

export default function LanguageScreen() {

    const [languages, setLanguages] = useState<LangRowType[]>([]);
    const [loading, setLoading] = useState<Boolean>(true);

    useEffect(() => {
        (async () => {
            getActiveLanguages(setLanguages, setLoading);
        })();
    }, []);
    console.log("printing results...");
    console.log(languages);
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
                <ScrollView>
                    {
                        languages.map((item) => (
                            <ActiveLanguage key={item.lang_id} item={{id: item.lang_id, title: item.lang_name}} onDelete={(id: number)=>{}}/>
                        ))
                    }
                </ScrollView>
            )}
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    loadingBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});