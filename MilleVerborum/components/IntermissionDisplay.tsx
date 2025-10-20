import { openLanguageDatabase } from '@/db/openDatabase';
import { LangRowType, StageMode } from '@/types';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React, {FC, useEffect, useState } from 'react';
import { StatusBar, PixelRatio, Pressable, StyleSheet, Text, View } from 'react-native';
import { scheduleOnRN } from 'react-native-worklets'
import Animated, { FadeInUp, FadeOutUp, FadeInDown, LinearTransition, StretchInX, useSharedValue, withDelay, withTiming, Easing } from 'react-native-reanimated';
import { VerticalStatusProgress } from 'react-native-vertical-status-progress';

import {
  Canvas,
  Path,
  SkFont,
  Skia,
  Group,
  matchFont,
  useFont,
  Fill,
  center
} from "@shopify/react-native-skia";
import type {SharedValue} from 'react-native-reanimated';

interface CircularProgressProps {
  strokeWidth: number;
  radius: number;
  percentageComplete: SharedValue<number>;
  centerLevel: number;
  incrementLevel: boolean;
}

// const animationState = useValue(0);
    const radius = PixelRatio.roundToNearestPixel(130);

const DonutChart: FC<CircularProgressProps> = ({
  strokeWidth,
  radius,
  percentageComplete,
  centerLevel,
  incrementLevel
}) => {
  const innerRadius = radius - strokeWidth / 2;

  const path = Skia.Path.Make();
  path.addCircle(radius, radius, innerRadius);

const origin = {
  x: radius,
  y: radius,
};

const transform = [
  {
    rotate: -Math.PI / 2,
  },
];
  return (
    <View>
        <Canvas style={styles.ringChartContainer}>
              <Group origin = {origin} transform={transform}>
          <Path
            path={path}
            color="white"
            style="stroke"
            strokeJoin="round"
            strokeWidth={strokeWidth}
            strokeCap="round"
            start={0}
            end={percentageComplete}
          />
          </Group>
        </Canvas>
        {!incrementLevel ? (
          <Animated.View
            key={centerLevel}
            style={styles.textContainer}
            entering={FadeInDown.duration(400).delay(500)}
            exiting={FadeOutUp.duration(400)}
          >
            <Text style={styles.centerText}>{centerLevel}</Text>
          </Animated.View>
        ) : (
          <Animated.View
            key={centerLevel+1}
            style={styles.textContainer}
            entering={FadeInDown.duration(400)}
          >
            <Text style={styles.centerText}>{centerLevel + 1}</Text>
          </Animated.View>
        )}
    </View>
  );
};


type Status = {
  title: string;
  subtitle?: string;
  renderContent?: React.ReactNode;
  status: string;
};


type Props = {
    stageMode:          StageMode;
    //setVisibility:      React.Dispatch<React.SetStateAction<boolean>>;
    langId:             LangRowType["lang_id"];
    onComplete:        () => void;
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
    //setVisibility:  React.Dispatch<React.SetStateAction<boolean>>,
    strokeWidth:    number,
    animationState: SharedValue<number>,
    showSubtext:    boolean,
    showAllText:    boolean,
    onComplete:     () => void,
    incrementLevel: boolean,
    centerLevel:    number
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
                            scheduleOnRN(onComplete); // Use optional chaining to prevent crashing if undefined
                        })}
                        entering={FadeInUp.duration(400)}
                    >
                        <Text style={styles.text}>
                            Level {levelCounter}
                        </Text>
                        {showSubtext && (
                        <Animated.View
                            entering={StretchInX.duration(400)}
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
                            scheduleOnRN(onComplete); // Use optional chaining to prevent crashing if undefined
                        })}
                        entering={FadeInUp.duration(400)}
                    >
                        <Text style={styles.text}>
                            Level {levelCounter}
                        </Text>
                        {showSubtext && (
                        <Animated.View
                            entering={StretchInX.duration(400)}
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
                            scheduleOnRN(onComplete); // Use optional chaining to prevent crashing if undefined
                        })}
                        entering={FadeInUp.duration(400)}
                    >
                        {levelCounter < 100 ?(
                            <DonutChart
                                radius={radius}
                                strokeWidth={strokeWidth}
                                percentageComplete={animationState}
                                centerLevel={levelCounter-1}
                                incrementLevel={incrementLevel}
                            />
                        ) : (
                            <Animated.View
                                entering={FadeInUp.duration(400)}
                            >
                                <Text style={styles.subtext}>
                                    You have been won c:
                                </Text>
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
                            scheduleOnRN(onComplete); // Use optional chaining to prevent crashing if undefined
                        })}
                        entering={FadeInUp.duration(400)}
                    >
                        <Text style={styles.text}>
                            Level {levelCounter}
                        </Text>
                        {showSubtext && (
                        <Animated.View
                            entering={StretchInX.duration(400)}
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
        // setVisibility,
        langId,
        onComplete
    } : Props) {

    const [showSubtext, setShowSubtext] = useState<boolean>(false);
    const [showAllText, setShowAllText] = useState<boolean>(true);
    const [levelCounter, setLevelCounter] = useState<LangRowType["lang_level"]>(null);
    const [centerLevel, setcenterLevel] = useState<number>(99);
    const [incrementLevel, setIncrementLevel] = useState<boolean>(false);

    const STROKE_WIDTH = 12;
    const targetPercentage = 1;
    const animationState = useSharedValue(0);



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

    useEffect(() => {
        animationState.value = withDelay(
            2500,
            withTiming(
                targetPercentage, 
                {
                    duration: 2500,
                    easing: Easing.out(Easing.exp),
                }
            )
        );

        setTimeout(() => {
          setIncrementLevel(true);
        },
      4500);
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
                {renderIntermission(stageMode, levelCounter, STROKE_WIDTH, animationState, showSubtext, showAllText, onComplete, incrementLevel, centerLevel)}
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
        marginTop: 30,
        borderTopWidth:2,
        borderColor: '#ffffff',
        paddingTop: 30
    },
    progressTitleStyle : {
        fontSize: 30
    },
    progressSubtitleStyle: {
        fontSize: 15,
        color: '#ffffff'
    },
          ringChartContainer: {
    width: radius * 2,
    height: radius * 2,
  },
    textContainer: {
    ...StyleSheet.absoluteFillObject, // covers entire Canvas
    alignItems: "center",
    justifyContent: "center",
  },
  centerText: {
    fontSize: 96,
    color: "white",
    fontWeight: "bold",
  }


});