import IntermissionDisplay from '@/components/IntermissionDisplay';
import PracticeDeck from '@/components/PracticeDeck';
import TestDeck from '@/components/TestDeck';
import TrainDeck from '@/components/TrainDeck';
import { openLanguageDatabase } from '@/db/openDatabase';
import { LangRowType, StageMode } from '@/types';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';

type Props = {
    initStageMode: StageMode
};

type ThemeColours = {
    prime_col:      string,
    sec_col:        string,
    ter_col:        string | null
} | null

async function getThemeColours (
    lang_id:            number,
    setPrimaryColour:   React.Dispatch<React.SetStateAction<string>>,
    setSecondaryColour: React.Dispatch<React.SetStateAction<string>>,
    setTertiaryColour:  React.Dispatch<React.SetStateAction<string | null>>
) {
    try{
        const db = await openLanguageDatabase();
        const result: ThemeColours = await db.getFirstAsync("SELECT prime_col, sec_col, ter_col FROM languages where lang_id = ?;", lang_id);
        
        if (result) {
            setPrimaryColour(result.prime_col);
            setSecondaryColour(result.sec_col);
            if (result.ter_col) {setTertiaryColour(result.ter_col)};
        };
    } catch (error) {
        console.error("DB failed to open", error);
    }    
};

function renderStage(
    stageMode:          StageMode,
    setStageMode:       React.Dispatch<React.SetStateAction<StageMode>>,
    langId:             LangRowType["lang_id"],
    setInterVisible:    React.Dispatch<React.SetStateAction<boolean>>,
    primaryColour:      string,
    secondaryColour:    string,
    tertiaryColour:     string | null
) {
    switch (stageMode) {
        case    'practice':
            // console.log('opening practice display');
            // return <DeckDisplay stageMode={stageMode} setStageMode={setStageMode} langId={langId}/>
            return <PracticeDeck langId={langId} setStageMode={setStageMode} stageMode={stageMode} primaryColour={primaryColour} secondaryColour={secondaryColour} tertiaryColour={tertiaryColour} />
        case    'train':
            // console.log('opening training display');
            // return <DeckDisplay stageMode={stageMode} setStageMode={setStageMode} langId={langId}/>
            return <TrainDeck langId={langId} setStageMode={setStageMode} stageMode={stageMode} primaryColour={primaryColour} secondaryColour={secondaryColour} tertiaryColour={tertiaryColour}/>
        case    'test':
            // console.log('opening test display');
            // return <DeckDisplay stageMode={stageMode} setStageMode={setStageMode} langId={langId}/>
            return <TestDeck langId={langId} setStageMode={setStageMode} stageMode={stageMode} primaryColour={primaryColour} secondaryColour={secondaryColour} tertiaryColour={tertiaryColour}/>
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
    const [primaryColour, setPrimaryColour] = useState<string>('#ffffff');
    const [secondaryColour, setSecondaryColour] = useState<string>('#000000');
    const [tertiaryColour, setTertiaryColour] = useState<string | null>(null);


    useEffect(() => {
        const fetchColours = async () => {
            await getThemeColours(langId, setPrimaryColour, setSecondaryColour, setTertiaryColour);
        }
        fetchColours();
    }, []);

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
                    primaryColour,
                    secondaryColour,
                    tertiaryColour
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

