import LanguageListItem from '@/components/LanguageListItem';
import { openLanguageDatabase } from '@/db/openDatabase';
import { LangRowType } from '@/types';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView, Pressable, ScrollView } from 'react-native-gesture-handler';
import Animated, { LinearTransition, ZoomIn, ZoomOut } from 'react-native-reanimated';
import LanguageSelect from './LanguageSelect';
import Alphabet from './alphabet';
import MaskedView from '@react-native-masked-view/masked-view';

const hasMounted = useRef(false);


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
    const [isAlphabetVisible, setAlphabetVisibility] = useState<boolean>(false);
    const [langId, setLangId] = useState<number>(0);

    useFocusEffect(
        useCallback(() => {
            return () => {
                hasMounted.current = false;
                console.log('hasMounted is now ', hasMounted.current);
            };
        }, [])
    );

    useEffect(() => {
        if (!isModalVisible) {
            (async () => {
                getActiveLanguages(setLanguages, setLoading);
            })();
        }
    }, [isModalVisible, loading]);

    return (
            <GestureHandlerRootView>
                <LinearGradient
                    colors={['#7700ffff', '#00f9ff']}
                    style={StyleSheet.absoluteFill}
                />
                    <ScrollView style={styles.scrollView}>
                        {
                            languages.map((item) => (
                                <Animated.View
                                    key={item.lang_id}
                                    layout={LinearTransition.springify()}
                                    entering={hasMounted.current ? ZoomIn : undefined}
                                    exiting={ZoomOut}
                                >
                                    <LanguageListItem key={item.lang_id} item={{lang_id: item.lang_id, lang_name: item.lang_name}} setActiveLoading={setLoading} setAlphabetVisibility={setAlphabetVisibility} setLangId={setLangId} activeOnly={true}/>
                                </Animated.View>
                            ))
                        }
                    </ScrollView>
                    <View style={styles.modalBox}>
                        <Pressable style={styles.modalButton} onPress={
                            () =>{
                                hasMounted.current = true;
                                setModalVisibility(true);
                            }}
                        >
                            <MaskedView
                            style={{ flex: 1, flexDirection: 'row', height: '100%'}}
                            maskElement={
                                <View
                                    style={{
                                        // Transparent background because mask is based off alpha channel.
                                        backgroundColor: 'transparent',
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        flexDirection: 'row'
                                    }}
                                >
                                    <FontAwesome name="plus" size={20} style={styles.buttonIcon} />
                                    <Text style={styles.buttonLabel}>Add language</Text>
                                </View>
                            }
                            >
                                <LinearGradient
                                    colors={['#00f9ff', '#7700ffff']}
                                    style={StyleSheet.absoluteFill}
                                />
                            </MaskedView>
                        </Pressable>
                    </View>
                    <LanguageSelect
                        isModalVisible={isModalVisible}
                        setModalVisibility={setModalVisibility}
                    />
                    <Alphabet
                        isAlphabetVisible={isAlphabetVisible}
                        setAlphabetVisibility={setAlphabetVisibility}
                        langId={langId}
                    />
                <StatusBar translucent backgroundColor="transparent" />
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
        backgroundColor: '#ffffff',
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        minHeight: 75,
        maxWidth: 300
    },
    buttonLabel: {
        fontSize:       20,
        color:          '#000000ff'
    },
    buttonIcon: {
        marginRight: 18,
        color:          '#000000ff'
    },
    modalBox: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30
    },
    scrollView: {
        marginTop: 100
    }
});