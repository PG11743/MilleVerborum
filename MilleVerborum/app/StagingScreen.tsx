import ActiveDisplay from '@/components/ActiveDisplay';
import LevelDisplay from '@/components/LevelDisplay';
import { LangRowType, StageMode } from '@/types';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
    initStageMode: StageMode
};

// function progressStage(stageMode : StageMode) {
//     switch (stageMode)
// }

function renderStage(
    stageMode:      StageMode,
    setStageMode:   React.Dispatch<React.SetStateAction<StageMode>>,
    langId:         LangRowType["lang_id"]
) {
    switch (stageMode) {
        case    'active':
            console.log('opening active display');
            return <ActiveDisplay stageMode={stageMode} setStageMode={setStageMode} levelCounter={2}/>
        case    'fail':
            return <Text>fail display</Text>;
        default:
            console.log('opening level display');
            return <LevelDisplay stageMode={stageMode} setStageMode={setStageMode} langId={langId}/>
    }
}

export default function StagingScreen({initStageMode} : Props) {
    const [stageMode, setStageMode] = useState<StageMode>(initStageMode ?? 'level');
    const langId = Number(useLocalSearchParams().lang_id);
    console.log('language ID is ', langId);

    return (
        <View style={styles.container}>
            {renderStage
                (
                    stageMode,
                    setStageMode,
                    langId
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

