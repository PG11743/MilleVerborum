import IntermissionDisplay from '@/components/IntermissionDisplay';
import PracticeDeck from '@/components/PracticeDeck';
import TestDeck from '@/components/TestDeck';
import TrainDeck from '@/components/TrainDeck';
import { LangRowType, StageMode } from '@/types';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
    initStageMode: StageMode
};

// function progressStage(stageMode : StageMode) {
//     switch (stageMode)
// }

function renderStage(
    stageMode:          StageMode,
    setStageMode:       React.Dispatch<React.SetStateAction<StageMode>>,
    langId:             LangRowType["lang_id"],
    setInterVisible:    React.Dispatch<React.SetStateAction<boolean>>
) {
    switch (stageMode) {
        case    'practice':
            console.log('opening practice display');
            // return <DeckDisplay stageMode={stageMode} setStageMode={setStageMode} langId={langId}/>
            return <PracticeDeck langId={langId} setStageMode={setStageMode} stageMode={stageMode} />
        case    'train':
            console.log('opening training display');
            // return <DeckDisplay stageMode={stageMode} setStageMode={setStageMode} langId={langId}/>
            return <TrainDeck langId={langId} setStageMode={setStageMode} stageMode={stageMode} />
        case    'test':
            console.log('opening test display');
            // return <DeckDisplay stageMode={stageMode} setStageMode={setStageMode} langId={langId}/>
            return <TestDeck langId={langId} setStageMode={setStageMode} stageMode={stageMode} />
        case    'promotion':
            return <IntermissionDisplay stageMode={stageMode} setVisibility={setInterVisible} langId={langId} />;
        default:
            console.log('opening level display');
            // return <LevelDisplay stageMode={stageMode} setStageMode={setStageMode} langId={langId}/>
    }
}

export default function StagingScreen({initStageMode} : Props) {
    const [stageMode, setStageMode] = useState<StageMode>(initStageMode ?? 'practice');
    const langId = Number(useLocalSearchParams().lang_id);
    const [interVisible, setInterVisible] = useState<boolean>(false);
    console.log('language ID is ', langId);

    return (
        <View style={styles.container}>
            {renderStage
                (
                    stageMode,
                    setStageMode,
                    langId,
                    setInterVisible
                )
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container:  {
        flex:   1
    }
});

