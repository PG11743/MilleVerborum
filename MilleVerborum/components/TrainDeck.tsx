import Card from '@/components/Card';
import { openLanguageDatabase } from '@/db/openDatabase';
import { LangRowType, StageMode, WordRowType } from '@/types';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { Swiper, type SwiperCardRefType } from 'rn-swiper-list';
import IntermissionDisplay from './IntermissionDisplay';



type Props = {
    langId:         LangRowType["lang_id"];
    stageMode:      StageMode;
    setStageMode:   React.Dispatch<React.SetStateAction<StageMode>>;
};


async function getCardData (
    langId:             LangRowType["lang_id"],
    setWordData:        React.Dispatch<React.SetStateAction<WordRowType[]>>
) {
    console.log('running getCardData...');
    try{
        const db = await openLanguageDatabase();
        const result = await db.getFirstAsync<{curr_level: number}>('SELECT curr_level FROM languages WHERE lang_id = $lang_id', {$lang_id: langId});
        if (result) {
            const wordRows = await db.getAllAsync<{word_id: number, native_word: string, foreign_word: string, corr_count: number, fail_count: number}>('SELECT word_id, native_word, foreign_word, corr_count, fail_count FROM words WHERE lang_id = $lang_id AND word_rank BETWEEN $lower_range AND $higher_range', {$lang_id: langId, $lower_range: (result.curr_level * 10)-9, $higher_range: (result.curr_level * 10)});

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
    setFailCount:           React.Dispatch<React.SetStateAction<number>>
) {
    const tempData = [...wordData];
    for (let i = tempData.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tempData[i], tempData[j]] = [tempData[j], tempData[i]];
    }

    setFinishedDeck(false);

    setTimeout(() => {
        setFailCount(0);
        setWordData(tempData);
        setDeckKey(prevDeckKey => prevDeckKey + 1);
    }, 400);
}       

export default function TrainDeck(props : Props) {
    const [wordData, setWordData] = useState<WordRowType[]>([]);
    const [finishedDeck, setFinishedDeck] = useState<boolean>(false);
    const [exitingDeck, setExitingDeck] = useState<boolean>(false);
    const [intermissionVisible, setIntermissionVisible] = useState<boolean>(true);
    const [deckKey, setDeckKey] = useState<number>(0);
    const [failCount, setFailCount] = useState<number>(0);

    const ref = useRef<SwiperCardRefType>(null);

    useEffect(() => {
        getCardData(props.langId, setWordData);
    }, []);

    const renderCard = useCallback((data: WordRowType) => {
        return (
        <Card nativeText={data.nativeWord}/>
        );
    }, [wordData]);

    const renderFlippedCard = useCallback((data: WordRowType, index: number) => {
        return (
            <Card nativeText={data.nativeWord} foreignText={data.foreignWord} />
        );
    }, [wordData]);

    const OverlayLabelRight = useCallback(() => {
    return (
        <View
        style={[
            styles.overlayLabelContainer,
            {
            backgroundColor: 'red',
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
            backgroundColor: 'green',
            },
        ]}
        />
    );
    }, []);
    

    return (
        <GestureHandlerRootView>
            {intermissionVisible ? (
                <IntermissionDisplay setVisibility={setIntermissionVisible} stageMode={props.stageMode} langId={props.langId}/>
                ) : (
                    <Animated.View
                        style={styles.subContainer}
                        entering={FadeInUp.duration(400)}
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
                            onSwipeRight={() => {setFailCount(prevFailCount => prevFailCount + 1)}}
                            onSwipedAll={() => { if (wordData.length != 0) {setFinishedDeck(true)}}}
                        />
                        {(finishedDeck && !exitingDeck) && (
                            (failCount === 0) ? (
                                <Animated.View
                                    entering={FadeInUp.duration(400)}
                                    exiting={FadeOutUp.duration(400)}
                                    style={styles.trainEndContainer}
                                >
                                    <Text style={styles.text}>No wrong cards!</Text>
                                    <Pressable onPress={() => resetDeck(setFinishedDeck, wordData, setWordData, setDeckKey, setFailCount)} style={styles.trainPressable}>
                                        <FontAwesome name="undo" size={30} color="#000000ff" style={styles.resetButton}/>
                                        <Text style={styles.text}>Retry</Text>
                                    </Pressable>
                                    <Pressable
                                        onPress={() => {
                                            setExitingDeck(true);
                                            setTimeout(() => {
                                                props.setStageMode('test');
                                            }, 400)
                                            }
                                        }
                                        style={styles.trainPressable}
                                    >
                                        <FontAwesome name="arrow-right" size={30} color="#000000ff" style={styles.resetButton}/>
                                        <Text style={styles.text}>Attempt Promotion</Text>
                                    </Pressable>
                                </Animated.View>
                            ) : (
                                <Animated.View
                                    entering={FadeInUp.duration(400)}
                                    exiting={FadeOutUp.duration(400)}
                                    style={styles.trainEndContainer}
                                >
                                    <Text style={styles.text}>Incorrect cards: {failCount}</Text>
                                    <Pressable onPress={() => resetDeck(setFinishedDeck, wordData, setWordData, setDeckKey, setFailCount)} style={styles.trainPressable}>
                                        <FontAwesome name="undo" size={30} color="#000000ff" style={styles.resetButton}/>
                                        <Text style={styles.text}>Retry</Text>
                                    </Pressable>
                                </Animated.View>
                            )
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
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardStyle: {
    width: '90%',
    height: '90%',
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
    height: '90%',
    width: '90%',
  },
  text: {
    color: '#000000ff',
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
        borderRadius: 10,
        margin: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderWidth: 1
  },
  resetButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10
  }
});