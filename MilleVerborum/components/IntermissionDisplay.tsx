import { openLanguageDatabase } from '@/db/openDatabase';
import { LangRowType, StageMode } from '@/types';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp, LinearTransition, runOnJS } from 'react-native-reanimated';
import { VerticalStatusProgress } from 'react-native-vertical-status-progress';

type Status = {
  title: string;
  subtitle?: string;
  renderContent?: React.ReactNode;
  status: string;
};


type Props = {
    stageMode:          StageMode;
    setVisibility:      React.Dispatch<React.SetStateAction<boolean>>;
    langId:             LangRowType["lang_id"];
    onComplete?:        () => void;
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

function renderIntermission(
    stageMode:      StageMode,
    levelCounter:   LangRowType["lang_level"],
    setVisibility:  React.Dispatch<React.SetStateAction<boolean>>,
    showSubtext:    boolean,
    showAllText:    boolean,
    onComplete:     () => void
) {

    
    const practiceStatuses = [
        {
            title: 'Practice',
            subtitle: '',
            renderContent: (
                <Text style={styles.progressSubtitleStyle}>Learn these words before you progress</Text>
            ),
            status: 'practice',
        },
        {
            title: 'Training',
            subtitle: '',
            renderContent: (
                <Text style={styles.progressSubtitleStyle}>Get your new words correct</Text>
            ),
            status: 'training',
        },
        {
            title: 'Testing',
            subtitle: '',
            renderContent: (
                <Text style={styles.progressSubtitleStyle}>Test your knowledge against all words you have learned</Text>
            ),
            status: 'testing',
        }
    ];

    const statusColors = 
        {
            prevBallColor: '#00c076ff',
            currentBallColor: '#00c076ff',
            futureBallColor: '#ffffff',
            prevStickColor: '#00c076ff',
            currentStickColor: '#00c076ff',
            futureStickColor: '#ffffff',
            prevTitleColor: '#ffffff',
            currentTitleColor: '#ffffff',
            futureTitleColor: '#ffffff',
            prevSubtitleColor: '#ffffff',
            currentSubtitleColor: '#ffffff',
            futureSubtitleColor: '#ffffff'
        };

    const renderCustomBall = (label:Status, idx:number, isPrev: boolean, isFuture: boolean) => (
        <View style={
            {
                backgroundColor: isPrev? '#00c076ff' : '#ffffff',
                width: 30,
                height: 30,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 100,
                marginRight: 20,
                borderWidth: 3,
                borderColor: isFuture? '#ffffff' : '#00c076ff'
            }
        } >
            {(isPrev) ? (
                <FontAwesome name="check" size={10} color='#ffffff' />
            ) : (
                <Text style={{ color: isFuture? '#ffffff' : '#00c076ff', fontSize: 10, fontWeight: 'bold' }}>
                    
                </Text>
            )}
        </View>
    );

    const renderCustomStick = (label: Status, idx: number, isPrev: boolean, isFuture: boolean) => (
        <View style={
            {
                flex: 1,
                width: 2,
                backgroundColor: isFuture? '#ffffff' : '#00c076ff',
                marginVertical: 5,
                marginRight: 20
            }
        } />
    );

    const renderCustomChevron = (open:boolean, index:number) => (
        <View />
    );


    switch(stageMode) {
        case    'train':
            return (
                (showAllText && levelCounter) && (
                    <Animated.View
                        style={styles.levelBox}
                        layout={LinearTransition.springify().damping(100)}
                        exiting={FadeOutUp.duration(400).withCallback(() => {
                            runOnJS(setVisibility)(false);
                        })}
                        entering={FadeInUp.duration(400)}
                    >
                        <Text style={styles.text}>
                            Level {levelCounter} Training Round
                        </Text>
                        {showSubtext && (
                        <Animated.View
                            entering={FadeInUp.duration(400)}
                            style={styles.verticalStatusContainerStyle}
                            pointerEvents="none"
                        >
                            <VerticalStatusProgress
                                statuses={practiceStatuses}
                                currentStatus='training'
                                showOrder={true}
                                titleStyle={styles.progressTitleStyle}
                                subTitleStyle={styles.progressSubtitleStyle}
                                statusColors={statusColors}
                                renderBall={renderCustomBall}
                                renderStick={renderCustomStick}
                                renderChevron={renderCustomChevron}
                                accordion={true}
                                openAccordionStatus={true}
                            />
                        </Animated.View>
                        )}
                    </Animated.View>
                )
            );
        case    'test':
            return (
                (showAllText && levelCounter) && (
                    <Animated.View
                        style={styles.levelBox}
                        layout={LinearTransition.springify().damping(100)}
                        exiting={FadeOutUp.duration(400).withCallback(() => {
                            runOnJS(setVisibility)(false);
                        })}
                        entering={FadeInUp.duration(400)}
                    >
                        <Text style={styles.text}>
                            Level {levelCounter} Test Round
                        </Text>
                        {showSubtext && (
                        <Animated.View
                            entering={FadeInUp.duration(400)}
                            style={styles.verticalStatusContainerStyle}
                            pointerEvents="none"
                        >
                            <VerticalStatusProgress
                                statuses={practiceStatuses}
                                currentStatus='testing'
                                showOrder={true}
                                titleStyle={styles.progressTitleStyle}
                                subTitleStyle={styles.progressSubtitleStyle}
                                statusColors={statusColors}
                                renderBall={renderCustomBall}
                                renderStick={renderCustomStick}
                                renderChevron={renderCustomChevron}
                                accordion={true}
                                openAccordionStatus={true}
                            />
                        </Animated.View>
                        )}
                    </Animated.View>
                )
            );
        case    'promotion':
            return (
                (showAllText && levelCounter) && (
                    <Animated.View
                        style={styles.levelBox}
                        layout={LinearTransition.springify().damping(0)}
                        exiting={FadeOutUp.duration(400).withCallback(() => {
                            runOnJS(onComplete)(); // Use optional chaining to prevent crashing if undefined
                        })}
                        entering={FadeInUp.duration(400)}
                    >
                        <Text style={styles.text}>
                            Test complete!
                        </Text>
                        {showSubtext && (
                        <Animated.View
                            entering={FadeInUp.duration(400)}
                        >
                            {levelCounter < 100 ?(
                            <Text style={styles.subtext}>
                                You have been promoted to Level {levelCounter + 1}
                            </Text>
                            ) : (
                            <Text style={styles.subtext}>
                                You have been won c:
                            </Text>
                            )}
                        </Animated.View>
                        )}
                    </Animated.View>
                )
            );
        default:
            return (
                (showAllText && levelCounter) && (
                    <Animated.View
                        style={styles.levelBox}
                        layout={LinearTransition.springify().damping(100)}
                        exiting={FadeOutUp.duration(400).withCallback(() => {
                            runOnJS(setVisibility)(false);
                        })}
                        entering={FadeInUp.duration(400)}
                    >
                        <Text style={styles.text}>
                            Level {levelCounter}
                        </Text>
                        {showSubtext && (
                        <Animated.View
                            entering={FadeInUp.duration(400)}
                            style={styles.verticalStatusContainerStyle}
                            pointerEvents="none"
                        >
                            <VerticalStatusProgress
                                statuses={practiceStatuses}
                                currentStatus='practice'
                                showOrder={true}
                                titleStyle={styles.progressTitleStyle}
                                subTitleStyle={styles.progressSubtitleStyle}
                                statusColors={statusColors}
                                renderBall={renderCustomBall}
                                renderStick={renderCustomStick}
                                renderChevron={renderCustomChevron}
                                accordion={true}
                                openAccordionStatus={true}
                            />
                        </Animated.View>
                        )}
                    </Animated.View>
                )
            );
    }
}


export default function IntermissionDisplay({
        stageMode,
        setVisibility,
        langId,
        onComplete = () => {}
    } : Props) {

    const [showSubtext, setShowSubtext] = useState<boolean>(false);
    const [showAllText, setShowAllText] = useState<boolean>(true);
    const [levelCounter, setLevelCounter] = useState<LangRowType["lang_level"]>(null);

    console.log('RUNNING INTERMISSION...');
    useEffect(() => {
        getLevelData(langId, setLevelCounter);
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
        }, 8000);

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
                {() => renderIntermission(stageMode, levelCounter, setVisibility, showSubtext, showAllText, onComplete)}
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
        fontSize: 40,
        color: '#ffffff'
    },
    subtext: {
        fontSize: 20,
        color: '#ffffff'
    },
    verticalStatusContainerStyle: {
        marginHorizontal: 30,
        marginTop: 50
    },
    progressTitleStyle : {
        fontSize: 30
    },
    progressSubtitleStyle: {
        fontSize: 15,
        color: '#ffffff'
    }

});