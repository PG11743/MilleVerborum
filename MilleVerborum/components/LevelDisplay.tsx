import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp, LinearTransition } from 'react-native-reanimated';
import { useState, useEffect } from 'react';
type Props = {
    progressStage:  () => void
    levelCounter:   number
};

export default function LevelDisplay({progressStage, levelCounter} : Props) {
    const [showSubtext, setShowSubtext] = useState<boolean>(false);
    const [showAllText, setShowAllText] = useState<boolean>(true);

    useEffect(() => {
        const introTimer = setTimeout(() => {
            setShowSubtext(true);
        }, 1500);

        return () => clearTimeout(introTimer);
    }, []);

    useEffect(() => {
        const outroTimer = setTimeout(() => {
            setShowAllText(false);
        }, 5000);

        return () => clearTimeout(outroTimer);
    }, []);

    function skip() {
        if (!showSubtext) {
            setShowSubtext(true);
        } else {
            setShowAllText(false);
            progressStage();
        }
    }

    return (
        <Pressable onPress={skip} style={styles.container}>
            {showAllText && (
            <Animated.View
                style={styles.levelBox}
                layout={LinearTransition.springify().damping(0)}
                exiting={FadeOutUp.duration(400)}
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