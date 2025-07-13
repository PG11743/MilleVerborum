import Card from '@/components/Card';
import { StageMode } from '@/types';
import { useCallback, useRef, useState } from 'react';
import { StyleSheet, View, type ImageSourcePropType } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Swiper, type SwiperCardRefType } from 'rn-swiper-list';


type Props = {
    stageMode: StageMode;
    setStageMode:  React.Dispatch<React.SetStateAction<StageMode>>;
    levelCounter:   number
};

type Translation = {
    nativeText:     string,
    foreignText:    string
};

const IMAGES: ImageSourcePropType[] = [
    require('../assets/images/adaptive-icon.png'),
    require('../assets/images/react-logo.png'),
    require('../assets/images/splash-icon.png')
];

const TEXTDATA: Translation[] = [
    {
        nativeText:     'House',
        foreignText:    'Hus'
    },
    {
        nativeText:     'Water',
        foreignText:    'Van'
    },
    {
        nativeText:     'Friend',
        foreignText:    'Ven'
    },
];
export default function ActiveDisplay({setStageMode, levelCounter} : Props) {
    const [showSubtext, setShowSubtext] = useState<boolean>(false);
    const [showAllText, setShowAllText] = useState<boolean>(true);

    const ref = useRef<SwiperCardRefType>(null);

    const renderCard = useCallback((data: Translation) => {
        return (
        <Card nativeText={data.nativeText}/>
        );
    }, []);

    const renderFlippedCard = useCallback((data: Translation, index: number) => {
        console.log('rendering flipped card...');
        return (
            <Card nativeText={data.nativeText} foreignText={data.foreignText} />
        );
    }, []);

  const OverlayLabelRight = useCallback(() => {
    return (
      <View
        style={[
          styles.overlayLabelContainer,
          {
            backgroundColor: 'green',
          },
        ]}
      />
    );
  }, []);
  const OverlayLabelLeft = useCallback(() => {
    return (
      <View
        style={[
          styles.overlayLabelContainer,
          {
            backgroundColor: 'red',
          },
        ]}
      />
    );
  }, []);

    return (
        <GestureHandlerRootView>
            <Animated.View
                style={styles.subContainer}
                entering={FadeInUp.duration(400)}
            >
                <Swiper
                    ref={ref}
                    data={TEXTDATA}
                    cardStyle={styles.cardStyle}
                    overlayLabelContainerStyle={styles.overlayLabelContainerStyle}
                    renderCard={renderCard}
                    // onIndexChange={(index) => {
                    //     console.log('Current Active index', index);
                    // }}
                    // onSwipeRight={(cardIndex) => {
                    //     console.log('cardIndex', cardIndex);
                    // }}
                    onPress={() => {
                        // console.log('onPress');
                        ref.current?.flipCard();
                    }}
                    // onSwipedAll={() => {
                    //     console.log('onSwipedAll');
                    // }}
                    FlippedContent={renderFlippedCard}
                    // onSwipeLeft={(cardIndex) => {
                    //     console.log('onSwipeLeft', cardIndex);
                    // }}
                    disableBottomSwipe={true}
                    disableTopSwipe={true}
                    OverlayLabelRight={OverlayLabelRight}
                    OverlayLabelLeft={OverlayLabelLeft}
                    // onSwipeActive={() => {
                    //     console.log('onSwipeActive');
                    // }}
                    // onSwipeStart={() => {
                    //     console.log('onSwipeStart');
                    // }}
                    // onSwipeEnd={() => {
                    //     console.log('onSwipeEnd');
                    // }}
                />
            </Animated.View>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    bottom: 34,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  button: {
    height: 50,
    borderRadius: 40,
    aspectRatio: 1,
    backgroundColor: '#3A3D45',
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },
  renderFlippedCardContainer: {
    borderRadius: 15,
    backgroundColor: '#baeee5',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardStyle: {
    width: '90%',
    height: '90%',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  renderCardImage: {
    height: '100%',
    width: '100%',
    borderRadius: 15,
  },
  subContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayLabelContainer: {
    borderRadius: 15,
    height: '90%',
    width: '90%',
  },
  text: {
    color: '#001a72',
  },
  overlayLabelContainerStyle: {
    alignItems: 'center',
    justifyContent: 'center',
  }
});