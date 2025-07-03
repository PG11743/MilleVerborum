import { View, Text } from 'react-native';
import { useState } from 'react';

type StageMode = 'level' | 'fail' | 'active';

type Props = {
    initStageMode: StageMode
};

function renderStage(stageMode : StageMode) {
    switch (stageMode) {
        case    'active':
            return <Text>active display</Text>;
        case    'fail':
            return <Text>fail display</Text>;
        default:
            return <Text>level display</Text>
    }
}

export default function StagingScreen({initStageMode} : Props) {
    const [stageMode, setStageMode] = useState<StageMode>(initStageMode ?? 'level');
    return (
        <View>
            {renderStage(stageMode)}
        </View>
    );
}

