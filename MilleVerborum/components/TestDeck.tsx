import Card from '@/components/Card';
import { openLanguageDatabase } from '@/db/openDatabase';
import { LangRowType, StageMode, WordRowType } from '@/types';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { FadeInUp, SlideInDown, FadeOutUp } from 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { Swiper, type SwiperCardRefType } from 'rn-swiper-list';
import IntermissionDisplay from './IntermissionDisplay';
import ProgressToast from './ProgressToast';



type Props = {
    langId:         LangRowType["lang_id"];
    stageMode:      StageMode;
    setStageMode:   React.Dispatch<React.SetStateAction<StageMode>>;
    primaryColour:      string;
    secondaryColour:    string;
    tertiaryColour:     string | null;
};


async function getCardData (
    langId:             LangRowType["lang_id"],
    setWordData:        React.Dispatch<React.SetStateAction<WordRowType[]>>
) {
    try{
        const db = await openLanguageDatabase();
        const result = await db.getFirstAsync<{curr_level: number}>('SELECT curr_level FROM languages WHERE lang_id = $lang_id', {$lang_id: langId});
        if (result) {
            const wordRows = await db.getAllAsync<{word_id: number, native_word: string, foreign_word: string, corr_count: number, fail_count: number}>('SELECT word_id, native_word, foreign_word, corr_count, fail_count FROM words WHERE lang_id = $lang_id AND word_rank <= $higher_range', {$lang_id: langId, $higher_range: (result.curr_level * 10)});

            for (let i = wordRows.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [wordRows[i], wordRows[j]] = [wordRows[j], wordRows[i]];
            }

            setWordData(wordRows.map(row => ({
                wordId: row.word_id,
                nativeWord: row.native_word,
                foreignWord: row.foreign_word,
                corrCount: row.corr_count,
                failCount: row.fail_count
            })));

        } else {
            console.error('level counter is set to 0, user shouldn\'t be here');
        }
    } catch (error) {
        console.error("DB failed to open", error);
    }
}

async function resetDeck(
    setFinishedDeck:        React.Dispatch<React.SetStateAction<boolean>>,
    wordData:               WordRowType[],
    setWordData:            React.Dispatch<React.SetStateAction<WordRowType[]>>,
    setDeckKey:             React.Dispatch<React.SetStateAction<number>>,
    setIncorrectCount:      React.Dispatch<React.SetStateAction<number>>,
    setCorrectCount:        React.Dispatch<React.SetStateAction<number>>
) {
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
}

async function promoteLevel (
    langId:                     LangRowType["lang_id"],
    setStageMode:               React.Dispatch<React.SetStateAction<StageMode>>
) {
    try{
        const db = await openLanguageDatabase();
        const updateLanguageStatement = await db.prepareAsync('UPDATE languages SET curr_level = curr_level + 1 WHERE lang_id = $lang_id AND curr_level <= 99');
        const result = await updateLanguageStatement.executeAsync({$lang_id: langId});
        await updateLanguageStatement.finalizeAsync();
        setStageMode('practice');
    } catch (error) {
        console.error("DB failed to open", error);
    }

}


export default function TestDeck(props : Props) {
    const [wordData, setWordData] = useState<WordRowType[]>([]);
    const [finishedDeck, setFinishedDeck] = useState<boolean>(false);
    const [exitingDeck, setExitingDeck] = useState<boolean>(false);
    const [intermissionVisible, setIntermissionVisible] = useState<boolean>(true);
    const [deckKey, setDeckKey] = useState<number>(0);
    const [correctCount, setCorrectCount] = useState<number>(0);
    const [incorrectCount, setIncorrectCount] = useState<number>(0);
    const [currStageMode, setCurrStagemode] = useState<StageMode>(props.stageMode);

    const incorrectCountRef = useRef(incorrectCount);

    const ref = useRef<SwiperCardRefType>(null);

    useEffect(() => {
        getCardData(props.langId, setWordData);
    }, []);

    useEffect(() => {
        incorrectCountRef.current = incorrectCount;
    }, [incorrectCount]);

    const renderCard = useCallback((data: WordRowType) => {
        return (
            <Card nativeText={data.nativeWord} backgroundColour={props.primaryColour} textColour={props.secondaryColour} borderColour={(props.tertiaryColour) ? props.tertiaryColour : props.secondaryColour}/>
        );
    }, [wordData]);

    const renderFlippedCard = useCallback((data: WordRowType, index: number) => {
        return (
            <Card nativeText={data.nativeWord} foreignText={data.foreignWord}  backgroundColour={props.secondaryColour} textColour={props.primaryColour} borderColour={(props.tertiaryColour) ? props.tertiaryColour : props.primaryColour}/>
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
        <GestureHandlerRootView>
            {intermissionVisible ? (
                <IntermissionDisplay
                    setVisibility={setIntermissionVisible}
                    stageMode={currStageMode}
                    langId={props.langId}
                    onComplete={() => {
                        promoteLevel(props.langId, props.setStageMode);
                    }}
                />
                ) : (
                    <Animated.View
                        style={styles.subContainer}
                        entering={SlideInDown.duration(400)}
                        exiting={FadeOutUp.duration(400)}
                        key={deckKey}
                    >
                        <Swiper
                            ref={ref}
                            data={wordData}
                            prerenderItems={20}
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
                                setIncorrectCount(prevIncorrectCount => {
                                    const newCount = prevIncorrectCount + 1;
                                    incorrectCountRef.current = newCount;
                                    return newCount;
                                });
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
                                if (incorrectCountRef.current === 0) {
                                    setTimeout(() => {
                                        setExitingDeck(true);
                                        setCurrStagemode('promotion');
                                        setIntermissionVisible(true);
                                    }, 400);
                                } else {
                                    setFinishedDeck(true);
                                }
                                }
                            }
                        />
                        <ProgressToast
                            correct={correctCount}
                            incorrect={incorrectCount}
                            remaining={(wordData.length - (correctCount + incorrectCount))}
                        />
                        {(finishedDeck && !exitingDeck) && (
                            <Animated.View
                                entering={FadeInUp.duration(400)}
                                exiting={FadeOutUp.duration(400)}
                                style={styles.testEndContainer}
                            >
                                <Text style={styles.text}>Incorrect cards: {incorrectCount}</Text>
                                <Pressable onPress={() => resetDeck(setFinishedDeck, wordData, setWordData, setDeckKey, setIncorrectCount, setCorrectCount)} style={styles.testPressable}>
                                    <FontAwesome name="undo" size={30} color="#000000ff" style={styles.resetButton}/>
                                    <Text style={styles.buttonText}>Retry</Text>
                                </Pressable>
                            </Animated.View>
                        )}
                    </Animated.View>
                )
            }
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 200
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
  },
  resetButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10
  }
});