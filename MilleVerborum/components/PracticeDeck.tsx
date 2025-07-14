import Card from '@/components/Card';
import { openLanguageDatabase } from '@/db/openDatabase';
import { LangRowType, StageMode } from '@/types';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { FadeInUp, FadeOutUp, runOnJS } from 'react-native-reanimated';
import { Swiper, type SwiperCardRefType } from 'rn-swiper-list';
import IntermissionDisplay from './IntermissionDisplay';



type Props = {
    langId:         LangRowType["lang_id"];
    stageMode:      StageMode;
    setStageMode:   React.Dispatch<React.SetStateAction<StageMode>>;
};

type Translation = {
    wordId:         number
    nativeWord:     string,
    foreignWord:    string
};

async function getCardData (
    langId:             LangRowType["lang_id"],
    setWordData:        React.Dispatch<React.SetStateAction<Translation[]>>
) {
    console.log('running getCardData...');
    try{
        const db = await openLanguageDatabase();
        const result = await db.getFirstAsync<{curr_level: number}>('SELECT curr_level FROM languages WHERE lang_id = $lang_id', {$lang_id: langId});
        // console.log('results from language interrogation:');
        // console.log(result);
        if (result) {
            const wordRows = await db.getAllAsync<{word_id: number, native_word: string, foreign_word: string}>('SELECT word_id, native_word, foreign_word FROM words WHERE lang_id = $lang_id AND word_rank BETWEEN $lower_range AND $higher_range', {$lang_id: langId, $lower_range: (result.curr_level * 10)-9, $higher_range: (result.curr_level * 10)});

            for (let i = wordRows.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [wordRows[i], wordRows[j]] = [wordRows[j], wordRows[i]];
            }

            setWordData(wordRows.map(row => ({
                wordId: row.word_id,
                nativeWord: row.native_word,
                foreignWord: row.foreign_word
            })));

        } else {
            console.error('level counter is set to 0, user shouldn\'t be here');
        }
    } catch (error) {
        console.error("DB failed to open", error);
    }
}

async function resetDeck(
    setFinishedDeck:    React.Dispatch<React.SetStateAction<boolean>>,
    wordData:           Translation[],
    setWordData:        React.Dispatch<React.SetStateAction<Translation[]>>,
    ref:                React.RefObject<SwiperCardRefType | null>
) {
    // console.log('data in wordData: ', wordData);
    // const tempData = wordData;
    // for (let i = tempData.length - 1; i > 0; i--) {
    //     const j = Math.floor(Math.random() * (i + 1));
    //     [tempData[i], tempData[j]] = [tempData[j], tempData[i]];
    // }

    // setWordData(tempData.map(row => ({
    //     wordId: row.wordId,
    //     nativeWord: row.nativeWord,
    //     foreignWord: row.foreignWord
    // })));
    setFinishedDeck(false);

    for (let i = 0; i < wordData.length; i++) {
        ref.current?.swipeBack();
        await new Promise((resolve) => setTimeout(resolve, 50));
        // console.log(ref.current);
    }
}



export default function PracticeDeck(props : Props) {
    const [wordData, setWordData] = useState<Translation[]>([]);
    const [finishedDeck, setFinishedDeck] = useState<boolean>(false);
    const [intermissionVisible, setIntermissionVisible] = useState<boolean>(true);
    console.log('running PracticeDeck');

    const ref = useRef<SwiperCardRefType>(null);

    useEffect(() => {
        getCardData(props.langId, setWordData);
    }, []);

    const renderCard = useCallback((data: Translation) => {
        return (
        <Card nativeText={data.nativeWord}/>
        );
    }, [wordData]);

    const renderFlippedCard = useCallback((data: Translation, index: number) => {
        return (
            <Card nativeText={data.nativeWord} foreignText={data.foreignWord} />
        );
    }, [wordData]);


    return (
        <GestureHandlerRootView>
            {intermissionVisible ? (
                <IntermissionDisplay setVisibility={setIntermissionVisible} stageMode={props.stageMode} langId={props.langId}/>
                ) : (
                    <Animated.View
                        style={styles.subContainer}
                        entering={FadeInUp.duration(400)}
                        exiting={FadeOutUp.duration(400)}
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
                            onSwipedAll={() => { if (wordData.length != 0) {setFinishedDeck(true)}}}
                        />
                        {finishedDeck && (
                            <Animated.View
                                entering={FadeInUp.duration(400)}
                                exiting={FadeOutUp.duration(400).withCallback(() => {runOnJS(props.setStageMode)('train')})}
                                style={styles.practiceEndContainer}
                            >
                                <Pressable onPress={() => resetDeck(setFinishedDeck, wordData, setWordData, ref)} style={styles.practicePressable}>
                                    <FontAwesome name="undo" size={30} color="#000000ff" style={styles.resetButton}/>
                                    <Text style={styles.text}>Reset</Text>
                                </Pressable>
                                <Pressable
                                    onPress={
                                        () => {
                                            console.log('hiding practice buttons');
                                            // props.setStageMode('train');
                                            setFinishedDeck(false);
                                        }
                                    }
                                    style={
                                        styles.practicePressable
                                    }
                                >
                                    <FontAwesome name="arrow-right" size={30} color="#000000ff" style={styles.resetButton}/>
                                    <Text style={styles.text}>Begin Training</Text>
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
  practiceEndContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 200
  },
  practicePressable: {
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