import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

type Props = {
    nativeText :        string;
    foreignText?:       string;
    pronunciation?:     string;
    backgroundColour:   string;
    textColour:         string;
    borderColour:       string;
};

export default function Card (props : Props) {
    // console.log(props);
    return (
        <View style={styles.renderCardContainer}>
                <LinearGradient
                    colors={['#00f9ff', '#7700ffff']}
                    style={styles.linearGradientBorder}
                >
            <View style={styles.innerCardContainer}>
                {props.foreignText ? (
                <View style={styles.cardTextContainer}>
                                        <MaskedView
                    style={{ flex: 1, flexDirection: 'row', height: '100%', width: '100%' }}
                    maskElement={
                        <View
                            style={{
                                // Transparent background because mask is based off alpha channel.
                                backgroundColor: 'transparent',
                                flex: 1,
                                paddingTop: 200,
                                alignItems: 'center',
                            }}
                        >
                            <View>
                                <View style={styles.nativeBox}>
                                    <Text style={styles.text}>{props.nativeText}</Text>
                                </View>
                                <View style={styles.foreignBox}>
                                    <Text style={styles.subtext}>{props.foreignText}</Text>
                                </View>
                                <View style={styles.pronunciationBox}>
                                    <Text style={styles.subtext}>[{props.pronunciation}]</Text>
                                </View>
                            </View>
                        </View>
                    }
                    >
                        {/* Shows behind the mask, you can put anything here, such as an image */}
                        <LinearGradient
                            colors={['#00f9ff', '#7700ffff']}
                            style={StyleSheet.absoluteFill}
                        />
                    </MaskedView>
                    {/* <View>
                        <Text style={[styles.text, {color: props.textColour}]}>{props.nativeText}</Text>
                    </View>
                    <View style={[styles.foreignBox, {borderColor: props.borderColour}]}>
                        <Text style={[styles.subtext, {color: props.textColour}]}>{props.foreignText}</Text>
                    </View>
                    <View>
                        <Text style={[styles.subtext, {color: props.textColour}]}>[{props.pronunciation}]</Text>
                    </View> */}
                </View>
                ) : (                    
                <View style={styles.cardTextContainer}>
                    <MaskedView
                    style={{ flex: 1, flexDirection: 'row', height: '100%', width: '100%' }}
                    maskElement={
                        <View
                            style={{
                                // Transparent background because mask is based off alpha channel.
                                backgroundColor: 'transparent',
                                flex: 1,
                                paddingTop: 200,
                                alignItems: 'center',
                            }}
                        >
                            <View
                                style={{flexDirection: 'row'}}
                            >
                                <Text style={styles.text}>{props.nativeText}</Text>
                            </View>
                        </View>
                    }
                    >
                        {/* Shows behind the mask, you can put anything here, such as an image */}
                        <LinearGradient
                            colors={['#00f9ff', '#7700ffff']}
                            style={StyleSheet.absoluteFill}
                        />
                    </MaskedView>
                </View>
                )}
            </View>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    renderCardContainer: {
        flex: 1,
        borderRadius: 35,
        alignItems: 'center',
        width: '100%',
        height: '100%',
        padding: 30,
        backgroundColor: '#ffffff'
    },
    linearGradientBorder: {
        height: '100%',
        width:  '100%',
        borderRadius: 17,
        padding: 3
    },
    innerCardContainer: {
        flex: 1,
        width: '100%',
        height: '100%',
        borderRadius: 14,
        // paddingTop: 200,
        backgroundColor: '#ffffff'
    },
    cardTextContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        flex: 1
    },
    nativeBox:  {
        alignItems: 'center'
    },
    foreignBox: {
        alignItems: 'center',
        borderTopWidth: 2,
        borderColor: 'black',
        paddingTop: 20,
        marginTop: 20,
        marginLeft: 'auto',
        marginRight: 'auto',
        width: 100,
        height: 100
    },
    text:   {
        fontSize: 40,
        color: 'black'
    },
    subtext:    {
        fontSize: 30
    },
    pronunciationBox: {
        alignItems: 'center'
    }
});