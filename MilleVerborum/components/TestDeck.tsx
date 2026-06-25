import Card from '@/components/Card';
import { openLanguageDatabase } from '@/db/openDatabase';
import { LangRowType, StageMode, WordRowType, WordRowTypeDB } from '@/types';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import ProgressToast from './ProgressToast';
import Animated, { 
    FadeInUp, 
    FadeOutUp, 
    useAnimatedStyle, 
    withTiming, 
    useSharedValue,
    Easing 
} from 'react-native-reanimated';
import { Swiper, type SwiperCardRefType } from 'rn-swiper-list';
import IntermissionDisplay from './IntermissionDisplay';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';

type Props = {
    langId:         LangRowType["lang_id"];
    stageMode:      StageMode;
    setStageMode:   React.Dispatch<React.SetStateAction<StageMode>>;
    setCurrLevel:   React.Dispatch<React.SetStateAction<number>>;
    wordData:       WordRowType[];
};

export default function TestDeck(props : Props) {
    const [wordData, setWordData] = useState<WordRowType[]>(props.wordData);
    const [finishedDeck, setFinishedDeck] = useState<boolean>(false);
    const [exitingDeck, setExitingDeck] = useState<boolean>(false);
    const [intermissionVisible, setIntermissionVisible] = useState<boolean>(true);
    const [correctCount, setCorrectCount] = useState<number>(0);
    const [incorrectCount, setIncorrectCount] = useState<number>(0);
    const incorrectCountRef = useRef(incorrectCount);
    const [activeDeck, setActiveDeck] = useState<'primary' | 'secondary'>('primary');
    const [primaryDepth, setPrimaryDepth] = useState<number>(10);
    const [secondaryDepth, setSecondaryDepth] = useState<number>(5);
    const [nextSliceIndex, setNextSliceIndex] = useState<number>(20);
    const [primaryKey, setPrimaryKey] = useState<number>(100);
    const [secondaryKey, setSecondaryKey] = useState<number>(200);
    const [deckKey, setDeckKey] = useState<number>(0);
    const [primaryData, setPrimaryData] = useState<WordRowType[]>([]);
    const [secondaryData, setSecondaryData] = useState<WordRowType[]>([]);
    const ref = useRef<SwiperCardRefType>(null);
    const ref2 = useRef<SwiperCardRefType>(null);

    // --- STALE CLOSURE PREVENTION ---
    // This ref guarantees the third-party swiper always reads the latest state arrays 
    // even if it aggressively caches the onSwipedAll callback internally.
    const swiperStateRef = useRef({ primaryData, secondaryData, wordData, nextSliceIndex });
    useEffect(() => {
        swiperStateRef.current = { primaryData, secondaryData, wordData, nextSliceIndex };
    }, [primaryData, secondaryData, wordData, nextSliceIndex]);

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
        if (wordData && wordData.length > 0) {
            setPrimaryData(wordData.slice(0, 10));
            setSecondaryData([]);
            setActiveDeck('primary');
            setPrimaryDepth(10);
            setSecondaryDepth(5);
            setNextSliceIndex(20);
            setPrimaryKey(prev => prev + 1);
            setSecondaryKey(prev => prev + 1);
            const timer = setTimeout(() => {
                setSecondaryData(wordData.slice(10, 20));
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [wordData, deckKey]);

    useEffect(() => {
        incorrectCountRef.current = incorrectCount;
    }, [incorrectCount]);

    // Triggers the smooth slide-in without physics bounce
    useEffect(() => {
        if (!intermissionVisible) {
            slideY.value = withTiming(0, { duration: 400, easing: Easing.out(Easing.cubic) });
            containerOpacity.value = withTiming(1, { duration: 300 });
        } else {
            slideY.value = 1000;
            containerOpacity.value = 0;
        }
    }, [intermissionVisible, deckKey]);

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

    const renderCard = useCallback((data: WordRowType) => {
        return <Card nativeText={data.nativeWord}/>;
    }, []);

    const renderFlippedCard = useCallback((data: WordRowType, index: number) => {
        return <Card nativeText={data.nativeWord} foreignText={data.foreignWord} pronunciation={data.pronunciation}/>;
    }, []);

    const primaryContainerStyle = useAnimatedStyle(() => {
        const isCurrent = activeDeck === 'primary';
        return {
            opacity: 1,
            transform: [{ scale: withTiming(isCurrent ? 1 : 0.93, { duration: 300 }) }]
        };
    });

    const secondaryContainerStyle = useAnimatedStyle(() => {
        const isCurrent = activeDeck === 'secondary';
        return {
            opacity: 1,
            transform: [{ scale: withTiming(isCurrent ? 1 : 0.93, { duration: 300 }) }]
        };
    });

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            {intermissionVisible && (
                <IntermissionDisplay onComplete={() => setIntermissionVisible(false)} stageMode={props.stageMode} langId={props.langId}/>
            )}

            {/* Absolute positioning prevents layout collisions with the Intermission Display */}
            <Animated.View
                pointerEvents={intermissionVisible ? 'none' : 'auto'}
                style={[
                    StyleSheet.absoluteFillObject, 
                    { alignItems: 'center', justifyContent: 'center' },
                    optimizedSlideStyle
                ]}
                exiting={FadeOutUp.duration(400)}
                key={deckKey}
            >
                {/* PRIMARY DECK CONTAINER */}
                <Animated.View style={[styles.absoluteBox, primaryContainerStyle, { zIndex: primaryDepth }]}>
                    <View style={styles.subContainer}>
                        {primaryData.length > 0 && (
                            <Swiper
                                key={primaryKey}
                                ref={ref}
                                data={primaryData}
                                cardStyle={styles.cardStyle}
                                overlayLabelContainerStyle={styles.overlayLabelContainerStyle}
                                renderCard={renderCard}
                                onPress={() => ref.current?.flipCard()}
                                FlippedContent={renderFlippedCard}
                                disableBottomSwipe={true}
                                disableTopSwipe={true}
                                OverlayLabelRight={OverlayLabelRight}
                                OverlayLabelLeft={OverlayLabelLeft}
                                onSwipeRight={() => {
                                    setIncorrectCount(prevIncorrectCount => prevIncorrectCount + 1);
                                    Toast.show({
                                        type: 'incorrectToast', // or 'error' | 'info'
                                    });
                                }}
                                onSwipeLeft={() => {
                                    setCorrectCount(prevCorrectCount => prevCorrectCount + 1);
                                    Toast.show({
                                        type: 'incorrectToast', // or 'error' | 'info'
                                    });
                                }}
                                onSwipedAll={() => {
                                    // Bypass stale closure cache by pulling from our live ref
                                    const state = swiperStateRef.current;
                                    if (state.secondaryData.length > 0) {
                                        setActiveDeck('secondary');
                                        setSecondaryDepth(15);
                                        setPrimaryDepth(1);
                                        setTimeout(() => {
                                            if (state.nextSliceIndex < state.wordData.length) {
                                                setPrimaryData(state.wordData.slice(state.nextSliceIndex, state.nextSliceIndex + 10));
                                                setNextSliceIndex(prev => prev + 10);
                                                setPrimaryKey(prev => prev + 1);
                                            } else {
                                                setPrimaryData([]);
                                            }
                                        }, 600);
                                    } else {
                                        setFinishedDeck(true);
                                    }
                                }}
                            />
                        )}
                    </View>
                </Animated.View>

                {/* SECONDARY DECK CONTAINER */}
                <Animated.View style={[styles.absoluteBox, secondaryContainerStyle, { zIndex: secondaryDepth }]}>
                    <View style={styles.subContainer}>
                        {secondaryData.length > 0 && (
                            <Swiper
                                key={secondaryKey}
                                ref={ref2}
                                data={secondaryData}
                                cardStyle={styles.cardStyle}
                                overlayLabelContainerStyle={styles.overlayLabelContainerStyle}
                                renderCard={renderCard}
                                onPress={() => ref2.current?.flipCard()}
                                FlippedContent={renderFlippedCard}
                                disableBottomSwipe={true}
                                disableTopSwipe={true}
                                OverlayLabelRight={OverlayLabelRight}
                                OverlayLabelLeft={OverlayLabelLeft}
                                onSwipeRight={() => {
                                    setIncorrectCount(prevIncorrectCount => prevIncorrectCount + 1);
                                    Toast.show({
                                        type: 'incorrectToast', // or 'error' | 'info'
                                    });
                                }}
                                onSwipeLeft={() => {
                                    setCorrectCount(prevCorrectCount => prevCorrectCount + 1);
                                    Toast.show({
                                        type: 'incorrectToast', // or 'error' | 'info'
                                    });
                                }}
                                onSwipedAll={() => {
                                    const state = swiperStateRef.current;
                                    if (state.primaryData.length > 0) {
                                        setActiveDeck('primary');
                                        setPrimaryDepth(15);
                                        setSecondaryDepth(1);
                                        setTimeout(() => {
                                            if (state.nextSliceIndex < state.wordData.length) {
                                                setSecondaryData(state.wordData.slice(state.nextSliceIndex, state.nextSliceIndex + 10));
                                                setNextSliceIndex(prev => prev + 10);
                                                setSecondaryKey(prev => prev + 1);
                                            } else {
                                                setSecondaryData([]);
                                            }
                                        }, 600);
                                    } else {
                                        setFinishedDeck(true);
                                    }
                                }}
                            />
                        )}
                    </View>
                </Animated.View>
                
                {/* END SCREEN OVERLAY CONTROL */}
                {(finishedDeck && !exitingDeck) && (
                    <Animated.View
                        entering={FadeInUp.duration(400)}
                        exiting={FadeOutUp.duration(400)}
                        style={styles.testEndContainer}
                    >
                        <Text style={styles.text}>Incorrect cards: {incorrectCount}</Text>
                        <Pressable 
                            onPress={() => {
                                containerOpacity.value = withTiming(0, { duration: 250 });
                                slideY.value = withTiming(1000, { duration: 400, easing: Easing.in(Easing.cubic) });
                                
                                const tempData = [...wordData];
                                for (let i = tempData.length - 1; i >= 0; i--) {
                                    const j = Math.floor(Math.random() * (i + 1));
                                    [tempData[i], tempData[j]] = [tempData[j], tempData[i]];
                                }
                                setFinishedDeck(false);
                                setTimeout(() => {
                                    setIncorrectCount(0);
                                    setCorrectCount(0);
                                    setWordData(tempData);
                                    setDeckKey(prevDeckKey => prevDeckKey + 1);
                                }, 400);
                            }} 
                            style={styles.testPressable}
                        >
                            <MaskedView
                                style={{ flex: 1, flexDirection: 'row', height: '100%' }}
                                maskElement={
                                    <View style={{ backgroundColor: 'transparent', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        <View style={{ flexDirection: 'row' }}>
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
                )}
            </Animated.View>
            <ProgressToast
                correct={correctCount}
                incorrect={incorrectCount}
                remaining={(wordData.length - (correctCount + incorrectCount))}
            />
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
    justifyContent: 'center'
  },
  absoluteBox: {
    position: 'absolute',
    width: '100%',
    height: '100%'
  },
  overlayLabelContainer: {
    borderRadius: 15,
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
  testEndContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  testPressable: {
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
    color:          '#000000ff'
  }
});