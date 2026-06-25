import IntermissionDisplay from '@/components/IntermissionDisplay';
import PracticeDeck from '@/components/PracticeDeck';
import TestDeck from '@/components/TestDeck';
import TrainDeck from '@/components/TrainDeck';
import { openLanguageDatabase } from '@/db/openDatabase';
import { LangRowType, StageMode } from '@/types';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { WordRowType, WordRowTypeDB } from '@/types';

type Props = {
    initStageMode: StageMode
};

type ThemeColours = {
    prime_col:      string,
    sec_col:        string,
    ter_col:        string | null
} | null


async function getCardData (
    langId:             LangRowType["lang_id"],
    setWordData:        React.Dispatch<React.SetStateAction<WordRowType[]>>
) {
    try{
        console.log('gathering data for promotion test...');
        const db = await openLanguageDatabase();
        const result = await db.getFirstAsync<{curr_level: number}>('SELECT curr_level FROM languages WHERE lang_id = $lang_id', {$lang_id: langId});
        if (result) {
            const wordRows = await db.getAllAsync<WordRowTypeDB>('SELECT word_id, native_word, foreign_word, pronunciation, corr_count, fail_count FROM words WHERE lang_id = $lang_id AND word_rank <= $higher_range', {$lang_id: langId, $higher_range: (result.curr_level * 10)});
            console.log('Word rows length is ', wordRows.length);
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

            console.log('finished mapping word data from db');

        } else {
            console.error('level counter is set to 0, user shouldn\'t be here');
        }
    } catch (error) {
        console.error("DB failed to open", error);
    }
}

function renderStage(
    stageMode:          StageMode,
    setStageMode:       React.Dispatch<React.SetStateAction<StageMode>>,
    langId:             LangRowType["lang_id"],
    setInterVisible:    React.Dispatch<React.SetStateAction<boolean>>,
    setCurrLevel:       React.Dispatch<React.SetStateAction<number>>,
    wordData:           WordRowType[]
) {
    switch (stageMode) {
        case    'practice':
            // console.log('opening practice display');
            // return <DeckDisplay stageMode={stageMode} setStageMode={setStageMode} langId={langId}/>
            return <PracticeDeck langId={langId} setStageMode={setStageMode} stageMode={stageMode}/>
        case    'train':
            // console.log('opening training display');
            // return <DeckDisplay stageMode={stageMode} setStageMode={setStageMode} langId={langId}/>
            return <TrainDeck langId={langId} setStageMode={setStageMode} stageMode={stageMode}/>
        case    'test':
            // console.log('opening test display');
            // return <DeckDisplay stageMode={stageMode} setStageMode={setStageMode} langId={langId}/>
            console.log('about to return test deck for render function');
            return <TestDeck langId={langId} setStageMode={setStageMode} stageMode={stageMode} setCurrLevel={setCurrLevel} wordData={wordData}/>
        case    'promotion':
            return <IntermissionDisplay stageMode={stageMode} onComplete={() => {setStageMode('practice')}} langId={langId} />;
        default:
            // console.log('opening level display');
            // return <LevelDisplay stageMode={stageMode} setStageMode={setStageMode} langId={langId}/>
    }
}

export default function StagingScreen({initStageMode} : Props) {
    const [stageMode, setStageMode] = useState<StageMode>(initStageMode ?? 'practice');
    const langId = Number(useLocalSearchParams().lang_id);
    const [interVisible, setInterVisible] = useState<boolean>(false);
    const [wordData, setWordData] = useState<WordRowType[]>([]);
    const [currLevel, setCurrLevel] = useState<number>(1);

    useEffect(() => {
        // const fetchColours = async () => {
        //     await getThemeColours(langId, setPrimaryColour, setSecondaryColour, setTertiaryColour);
        // }
        // fetchColours();
        const cardData = getCardData(langId, setWordData);
    }, [currLevel]);

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#7700ffff', '#00f9ff']}
                style={StyleSheet.absoluteFill}
            />
            {renderStage
                (
                    stageMode,
                    setStageMode,
                    langId,
                    setInterVisible,
                    setCurrLevel,
                    wordData
                )
            }
            <StatusBar translucent backgroundColor="transparent" />
        </View>
    );
}

const styles = StyleSheet.create({
    container:  {
        flex:   1
    }
});

