import { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, { FadeInUp, FadeOutUp, LinearTransition } from 'react-native-reanimated';

type StageMode = 'level' | 'fail' | 'active';

type Props = {
    stageMode: StageMode;
    setStageMode:  React.Dispatch<React.SetStateAction<StageMode>>;
    levelCounter:   number
};

export default function ActiveDisplay({setStageMode, levelCounter} : Props) {
    const [showSubtext, setShowSubtext] = useState<boolean>(false);
    const [showAllText, setShowAllText] = useState<boolean>(true);

    // useEffect(() => {
    //     const introTimer = setTimeout(() => {
    //         setShowSubtext(true);
    //     }, 1500);

    //     return () => clearTimeout(introTimer);
    // }, []);

    // useEffect(() => {
    //     const outroTimer = setTimeout(() => {
    //         setShowAllText(false);
    //     }, 5000);

    //     return () => clearTimeout(outroTimer);
    // }, []);

    // function skip() {
    //     if (!showSubtext) {
    //         setShowSubtext(true);
    //     } else {
    //         setShowAllText(false);
    //         setStageMode('active');
    //     }
    // }

    return (
        <Pressable onPress={() =>setShowSubtext(true)} style={styles.container}>
            {showAllText && (
            <Animated.View
                style={styles.nativeBox}
                layout={LinearTransition.springify().damping(0)}
                entering={FadeInUp.duration(400)}
                exiting={FadeOutUp.duration(400)}
            >
                <Text style={styles.text}>
                    Interesting Word
                </Text>
                {showSubtext && (
                <Animated.View
                    style={styles.foreignBox}
                    entering={FadeInUp.duration(400)}
                >
                    <Text style={styles.subtext}>
                        Blah Blah Blah
                    </Text>
                </Animated.View>
                )}
            </Animated.View>
            )}
        </Pressable>
        // <View style={styles.container}>
        //     <View style={styles.nativeBox}>
        //         <Text style={styles.text}>
        //             Interesting Word
        //         </Text>
        //     </View>
        //     <View style={styles.foreignBox}>
        //         <Text style={styles.subtext}>
        //             Blah blah blah
        //         </Text>
        //     </View>
        // </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 200
    },
    nativeBox: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 300
    },
    foreignBox: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 300
    },
    text:   {
        fontSize: 40
    },
    subtext: {
        fontSize: 20
    }
});