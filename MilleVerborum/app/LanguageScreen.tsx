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
                    colors={['#00f9ff', '#fdf902']}
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
                                    <LanguageListItem key={item.lang_id} item={{lang_id: item.lang_id, lang_name: item.lang_name}} setActiveLoading={setLoading} activeOnly={true}/>
                                </Animated.View>
                            ))
                        }
                    </ScrollView>
                    <Pressable style={styles.modalBox} onPress={
                        () =>{
                            hasMounted.current = true;
                            setModalVisibility(true);
                        }}
                    >
                        <View style={styles.modalButton}>
                            <FontAwesome name="plus" size={20} style={styles.buttonIcon} />
                            <Text style={styles.modalButtonText}>Add language</Text>
                        </View>
                    </Pressable>
                <LanguageSelect
                    isModalVisible={isModalVisible}
                    setModalVisibility={setModalVisibility}
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
    modalButtonText: {
        fontSize: 20
    },
    scrollView: {
        marginTop: 100
    }
});