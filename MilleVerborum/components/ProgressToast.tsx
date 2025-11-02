import { StyleSheet, Text, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import Animated, { SlideInDown, SlideOutUp } from 'react-native-reanimated';
import Toast, { ToastConfig } from 'react-native-toast-message';


type Props = {
    correct:    number,
    incorrect:  number,
    remaining:  number
}


export default function ProgressToast (componentProps: Props) {
    const pieData = [
        {value: componentProps.correct, color: '#12e34a'},
        {value: componentProps.incorrect, color: '#f04a3e'},
        {value: componentProps.remaining, color: '#ffffff'}
    ];
    
    const toastConfig: ToastConfig = {
        incorrectToast: ({ text1, props }) => (
            <View style={[ styles.toastContainer, {backgroundColor: '#ffffff' }]}>
                <PieChart
                    donut
                    radius={40}
                    innerRadius={35}
                    data={pieData}
                    centerLabelComponent={() => {
                    return <Animated.View
                            key={componentProps.remaining}
                            entering={SlideInDown.springify().stiffness(500).mass(0.2)}
                            exiting={SlideOutUp}
                        >
                            <Text style={{fontSize: 20}}>
                                {componentProps.remaining}
                            </Text>
                        </Animated.View>;
                    }}
                />
            </View>
        )

    };

    return (
        <Toast config={toastConfig} />
    );
}

const styles = StyleSheet.create({
    toastContainer: {
        marginTop: 50,
        flex: 1,
        borderRadius: 100,
        borderWidth: 3,
        borderColor: '#00f9ff'
    },
    renderCardContainer: {
        flex: 1,
        borderRadius: 15,
        alignItems: 'center',
        width: '100%',
        height: '100%',
        padding: 30
    },
    innerCardContainer: {
        paddingTop: 200,
        flex: 1,
        width: '100%',
        height: '100%',
        borderRadius: 15,
        borderWidth: 1
    },
    cardTextContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    nativeBox:  {
        borderBottomWidth: 2,
        borderColor: 'black',
        paddingBottom: 5
    },
    foreignBox: {
        alignItems: 'center',
        borderTopWidth: 2,
        borderColor: 'black',
        paddingTop: 20,
        marginTop: 20,
        width: 100,
        height: 100
    },
    text:   {
        fontSize: 40
    },
    subtext:    {
        fontSize: 30
    }
});