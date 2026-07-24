import Card from '@/components/Card';
import { openLanguageDatabase } from '@/db/openDatabase';
import { LangRowType, StageMode, WordRowType } from '@/types';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { 
    FadeInUp, 
    FadeOutUp, 
    useAnimatedStyle, 
    useSharedValue, 
    withTiming, 
    Easing 
} from 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { Swiper, type SwiperCardRefType } from 'rn-swiper-list';
import IntermissionDisplay from './IntermissionDisplay';
import ProgressToast from './ProgressToast';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';

type Props = {
    langId:         LangRowType["lang_id"];
    stageMode:      StageMode;
    setStageMode:   React.Dispatch<React.SetStateAction<StageMode>>;
};

async function getCardData(
    langId:             LangRowType["lang_id"],
    setWordData:        React.Dispatch<React.SetStateAction<WordRowType[]>>,
    setIsLoading:       React.Dispatch<React.SetStateAction<boolean>>
) {
    try {
        setIsLoading(true);
        const db = await openLanguageDatabase();
        const result = await db.getFirstAsync<{curr_level: number}>('SELECT curr_level FROM languages WHERE lang_id = $lang_id', {$lang_id: langId});
        if (result) {
            const wordRows = await db.getAllAsync<{word_id: number, native_word: string, foreign_word: string, pronunciation: string, corr_count: number, fail_count: number}>('SELECT word_id, native_word, foreign_word, pronunciation, corr_count, fail_count FROM words WHERE lang_id = $lang_id AND word_rank BETWEEN $lower_range AND $higher_range', {$lang_id: langId, $lower_range: (result.curr_level * 10)-9, $higher_range: (result.curr_level * 10)});

            for (let i = wordRows.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [wordRows[i], wordRows[j]] = [wordRows[j], wordRows[i]];
            }

            setWordData(wordRows.map(row => ({
                wordId: row.word_id,
                nativeWord: row.native_word,
                foreignWord: row.foreign_word,
                pronunciation: row.pronunciation,
                corrCount: row.corr_count,
                failCount: row.fail_count
            })));
        } else {
            console.error('level counter is set to 0, user shouldn\'t be here');
        }
    } catch (error) {
        console.error("DB failed to open", error);
    } finally {
        setIsLoading(false);
    }
}

export default function TrainDeck(props: Props) {
    const [wordData, setWordData] = useState<WordRowType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [intermissionVisible, setIntermissionVisible] = useState<boolean>(true);
    const [isIntermissionAnimationDone, setIsIntermissionAnimationDone] = useState<boolean>(false);
    
    const [finishedDeck, setFinishedDeck] = useState<boolean>(false);
    const [exitingDeck, setExitingDeck] = useState<boolean>(false);
    const [deckKey, setDeckKey] = useState<number>(0);
    const [correctCount, setCorrectCount] = useState<number>(0);
    const [incorrectCount, setIncorrectCount] = useState<number>(0);

    const ref = useRef<SwiperCardRefType>(null);

    // --- PERFORMANCE SHARED VALUES ---
    const slideY = useSharedValue(1000); 
    const containerOpacity = useSharedValue(0);

    const optimizedSlideStyle = useAnimatedStyle(() => {
        return {
            opacity: containerOpacity.value,
            transform: [{ translateY: slideY.value }],
        };
    });

    useEffect(() => {
        getCardData(props.langId, setWordData, setIsLoading);
    }, [props.langId]);

    const handleIntermissionComplete = useCallback(() => {
        setIsIntermissionAnimationDone(true);
    }, []);

    // Reveal deck only when both data loading AND intermission animation are complete
    useEffect(() => {
        if (isIntermissionAnimationDone && !isLoading) {
            setIntermissionVisible(false);
        }
    }, [isIntermissionAnimationDone, isLoading]);

    // Triggers smooth UI-thread slide-in animation
    useEffect(() => {
        if (!intermissionVisible) {
            slideY.value = withTiming(0, { duration: 400, easing: Easing.out(Easing.cubic) });
            containerOpacity.value = withTiming(1, { duration: 300 });
        } else {
            slideY.value = 1000;
            containerOpacity.value = 0;
        }
    }, [intermissionVisible, deckKey]);

    // Smooth reset handler
    const handleReset = () => {
        // 1. Send the deck down and fade it out on the UI thread
        containerOpacity.value = withTiming(0, { duration: 250 });
        slideY.value = withTiming(1000, { duration: 400, easing: Easing.in(Easing.cubic) });
        
        // 2. Hide the end screen buttons gracefully
        setFinishedDeck(false);

        // 3. Wait for the exit animation to finish before shuffling and remounting
        setTimeout(() => {
            const tempData = [...wordData];
            for (let i = tempData.length - 1; i >= 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [tempData[i], tempData[j]] = [tempData[j], tempData[i]];
            }
            
            setIncorrectCount(0);
            setCorrectCount(0);
            setWordData(tempData);
            setDeckKey(prevDeckKey => prevDeckKey + 1); // Updating this key re-triggers the slide-in useEffect
        }, 400);
    };

    const renderCard = useCallback((data: WordRowType) => {
        return (
            <Card nativeText={data.nativeWord}/>
        );
    }, [wordData]);

    const renderFlippedCard = useCallback((data: WordRowType, index: number) => {
        return (
            <Card nativeText={data.nativeWord} foreignText={data.foreignWord} pronunciation={data.pronunciation}/>
        );
    }, [wordData]);

    const OverlayLabelRight = useCallback(() => {
        return (
            <View
                style={[
                    styles.overlayLabelContainer,
                    {
                        backgroundColor: '#f04a3e',
                    },
                ]}
            />
        );
    }, []);

    const OverlayLabelLeft = useCallback(() => {
        return (
            <View
                style={[
                    styles.overlayLabelContainer,
                    {
                        backgroundColor: '#12e34a',
                    },
                ]}
            />
        );
    }, []);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            {intermissionVisible && (
                <IntermissionDisplay 
                    onComplete={handleIntermissionComplete} 
                    stageMode={props.stageMode} 
                    langId={props.langId}
                />
            )}
            
            <Animated.View
                pointerEvents={intermissionVisible ? 'none' : 'auto'}
                style={[
                    StyleSheet.absoluteFillObject,
                    styles.subContainer,
                    optimizedSlideStyle
                ]}
                exiting={FadeOutUp.duration(400)}
                key={deckKey}
            >
                <Swiper
                    ref={ref}
                    data={wordData}
                    cardStyle={styles.cardStyle}
                    overlayLabelContainerStyle={styles.overlayLabelContainerStyle}
                    renderCard={renderCard}
                    onPress={() => {
                        ref.current?.flipCard();
                    }}
                    FlippedContent={renderFlippedCard}
                    disableBottomSwipe={true}
                    disableTopSwipe={true}
                    OverlayLabelRight={OverlayLabelRight}
                    OverlayLabelLeft={OverlayLabelLeft}
                    onSwipeRight={() => {
                        setIncorrectCount(prevIncorrectCount => prevIncorrectCount + 1);
                        Toast.show({
                            type: 'incorrectToast',
                        });
                    }}
                    onSwipeLeft={() => {
                        setCorrectCount(prevCorrectCount => prevCorrectCount + 1);
                        Toast.show({
                            type: 'incorrectToast',
                        });
                    }}
                    onSwipedAll={() => { if (wordData.length !== 0) { setFinishedDeck(true) }}}
                />
                <ProgressToast
                    correct={correctCount}
                    incorrect={incorrectCount}
                    remaining={(wordData.length - (correctCount + incorrectCount))}
                />
                {(finishedDeck && !exitingDeck) && (
                    (incorrectCount === 0) ? (
                        <Animated.View
                            entering={FadeInUp.duration(400)}
                            exiting={FadeOutUp.duration(400)}
                            style={styles.trainEndContainer}
                        >
                            <Text style={styles.text}>No wrong cards!</Text>
                            <Pressable onPress={handleReset} style={styles.trainPressable}>
                                <MaskedView
                                    style={{ flex: 1, flexDirection: 'row', height: '100%' }}
                                    maskElement={
                                        <View
                                            style={{
                                                backgroundColor: 'transparent',
                                                flex: 1,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <View style={{flexDirection: 'row'}}>
                                                <FontAwesome name="undo" size={30} color="#000000ff" style={styles.buttonIcon}/>
                                                <Text style={styles.buttonText}>Retry</Text>
                                            </View>
                                        </View>
                                    }
                                >
                                    <LinearGradient
                                        colors={['#00f9ff', '#7700ffff']}
                                        style={StyleSheet.absoluteFill}
                                    />
                                </MaskedView>
                            </Pressable>
                            <Pressable
                                onPress={() => {
                                    setExitingDeck(true);
                                    setTimeout(() => {
                                        props.setStageMode('test');
                                    }, 400)
                                }}
                                style={styles.trainPressable}
                            >
                                <MaskedView
                                    style={{ flex: 1, flexDirection: 'row', height: '100%' }}
                                    maskElement={
                                        <View
                                            style={{
                                                backgroundColor: 'transparent',
                                                flex: 1,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <View style={{flexDirection: 'row'}}>
                                                <FontAwesome name="arrow-right" size={30} color="#000000ff" style={styles.buttonIcon}/>
                                                <Text style={styles.buttonText}>Promotion</Text>
                                            </View>
                                        </View>
                                    }
                                >
                                    <LinearGradient
                                        colors={['#00f9ff', '#7700ffff']}
                                        style={StyleSheet.absoluteFill}
                                    />
                                </MaskedView>
                            </Pressable>
                        </Animated.View>
                    ) : (
                        <Animated.View
                            entering={FadeInUp.duration(400)}
                            exiting={FadeOutUp.duration(400)}
                            style={styles.trainEndContainer}
                        >
                            <Text style={styles.text}>Incorrect cards: {incorrectCount}</Text>
                            <Pressable onPress={handleReset} style={styles.trainPressable}>
                                <MaskedView
                                    style={{ flex: 1, flexDirection: 'row', height: '100%' }}
                                    maskElement={
                                        <View
                                            style={{
                                                backgroundColor: 'transparent',
                                                flex: 1,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <View style={{flexDirection: 'row'}}>
                                                <FontAwesome name="undo" size={30} color="#000000ff" style={styles.buttonIcon}/>
                                                <Text style={styles.buttonText}>Retry</Text>
                                            </View>
                                        </View>
                                    }
                                >
                                    <LinearGradient
                                        colors={['#00f9ff', '#7700ffff']}
                                        style={StyleSheet.absoluteFill}
                                    />
                                </MaskedView>
                            </Pressable>
                        </Animated.View>
                    )
                )}
            </Animated.View>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    renderFlippedCardContainer: {
        borderRadius: 15,
        backgroundColor: '#baeee5',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 30
    },
    cardStyle: {
        width: '90%',
        height: '85%',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    subContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    overlayLabelContainer: {
        borderRadius: 35,
        height: '85%',
        width: '90%',
    },
    text: {
        color: '#ffffff',
        fontSize: 30
    },
    overlayLabelContainerStyle: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    trainEndContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 200
    },
    trainPressable: {
        borderRadius: 100,
        margin: 10,
        paddingVertical: 10,
        paddingHorizontal: 40,
        backgroundColor: '#ffffffff',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        minHeight: 75,
        maxWidth: 260
    },
    buttonIcon: {
        marginRight: 18,
        color: '#000000ff'
    }
});