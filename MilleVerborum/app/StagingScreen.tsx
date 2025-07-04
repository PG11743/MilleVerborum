import ActiveDisplay from '@/components/ActiveDisplay';
import LevelDisplay from '@/components/LevelDisplay';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type StageMode = 'level' | 'fail' | 'active';

type Props = {
    initStageMode: StageMode
};

// function progressStage(stageMode : StageMode) {
//     switch (stageMode)
// }

function renderStage(stageMode : StageMode, setStageMode : React.Dispatch<React.SetStateAction<StageMode>>) {
    switch (stageMode) {
        case    'active':
            console.log('opening active display');
            return <ActiveDisplay stageMode={stageMode} setStageMode={setStageMode} levelCounter={2}/>
        case    'fail':
            return <Text>fail display</Text>;
        default:
            console.log('opening level display');
            return <LevelDisplay stageMode={stageMode} setStageMode={setStageMode} levelCounter={2}/>
    }
}

export default function StagingScreen({initStageMode} : Props) {
    const [stageMode, setStageMode] = useState<StageMode>(initStageMode ?? 'level');
    return (
        <View style={styles.container}>
            {renderStage(stageMode, setStageMode)}
        </View>
    );
}

const styles = StyleSheet.create({
    container:  {
        flex:   1
    }
});

