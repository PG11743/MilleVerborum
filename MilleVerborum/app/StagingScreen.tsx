import { View, Text, StyleSheet } from 'react-native';
import { useState } from 'react';
import LevelDisplay from '@/components/LevelDisplay';

type StageMode = 'level' | 'fail' | 'active';

type Props = {
    initStageMode: StageMode
};

function progressStage() {
    console.log('oooo, progressing');
}

function renderStage(stageMode : StageMode) {
    switch (stageMode) {
        case    'active':
            return <Text>active display</Text>;
        case    'fail':
            return <Text>fail display</Text>;
        default:
            return <LevelDisplay progressStage={progressStage} levelCounter={2}/>
    }
}

export default function StagingScreen({initStageMode} : Props) {
    const [stageMode, setStageMode] = useState<StageMode>(initStageMode ?? 'level');
    return (
        <View style={styles.container}>
            {renderStage(stageMode)}
        </View>
    );
}

const styles = StyleSheet.create({
    container:  {
        flex:   1
    }
});

