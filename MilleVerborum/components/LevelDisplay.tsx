import { openLanguageDatabase } from '@/db/openDatabase';
import { LangRowType, StageMode } from '@/types';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, { FadeInUp, FadeOutUp, LinearTransition, runOnJS } from 'react-native-reanimated';

type Props = {
    stageMode:      StageMode;
    setStageMode:   React.Dispatch<React.SetStateAction<StageMode>>;
    langId:         LangRowType["lang_id"]
};

async function getLevelData (
    langId:             LangRowType["lang_id"],
    setLevelCounter:    React.Dispatch<React.SetStateAction<LangRowType["lang_level"]>>
) {
    console.log('running getLevelData...');
    try{
        const db = await openLanguageDatabase();
        const result = await db.getFirstAsync<{curr_level: number}>('SELECT curr_level FROM languages WHERE lang_id = $lang_id', {$lang_id: langId});
        if (result) {
            setLevelCounter(result.curr_level);
        } else {
            console.error('level counter is set to 0, user shouldn\'t be here');
        }
    } catch (error) {
        console.error("DB failed to open", error);
    }
}


export default function LevelDisplay(props : Props) {
    const [showSubtext, setShowSubtext] = useState<boolean>(false);
    const [showAllText, setShowAllText] = useState<boolean>(true);
    const [levelCounter, setLevelCounter] = useState<LangRowType["lang_level"]>(null);

    useEffect(() => {
        getLevelData(props.langId, setLevelCounter);
    }, []);

    useEffect(() => {
        const introTimer = setTimeout(() => {
            if (!showSubtext) {
                setShowSubtext(true);
            }
        }, 1500);

        return () => clearTimeout(introTimer);
    }, []);

    useEffect(() => {
        const outroTimer = setTimeout(() => {
            if (showAllText) {
                setShowAllText(false);
            }
        }, 5000);

        return () => clearTimeout(outroTimer);
    }, []);

    function skip() {
        if (!showSubtext) {
            setShowSubtext(true);
        } else {
            setShowAllText(false);
        }
    }

    return (
        <Pressable onPress={skip} style={styles.container}>
            {(showAllText && levelCounter) && (
            <Animated.View
                style={styles.levelBox}
                layout={LinearTransition.springify().damping(0)}
                exiting={FadeOutUp.duration(400).withCallback(() => {runOnJS(props.setStageMode)('practice');})}
            >
                <Text style={styles.text}>
                    Level {levelCounter}
                </Text>
                {showSubtext && (
                <Animated.View
                    entering={FadeInUp.duration(400)}
                >
                    <Text style={styles.subtext}>
                        Words {(levelCounter * 10)-9} to {levelCounter * 10}
                    </Text>
                </Animated.View>
                )}
            </Animated.View>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    levelBox: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 300,
        marginBottom: 200
    },
    text:   {
        fontSize: 40
    },
    subtext: {
        fontSize: 20
    }
});