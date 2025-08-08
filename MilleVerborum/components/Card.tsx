import { StyleSheet, Text, View } from 'react-native';

type Props = {
    nativeText :        string;
    foreignText?:       string;
    backgroundColour:   string;
    textColour:         string;
    borderColour:       string;
};

export default function Card (props : Props) {
    console.log(props);
    return (
        <View style={[styles.renderCardContainer, {backgroundColor: props.backgroundColour}]}>
            <View style={[styles.innerCardContainer, {backgroundColor: props.backgroundColour, borderColor: props.borderColour}]}>
                {props.foreignText ? (
                <View style={styles.cardTextContainer}>
                    <View>
                        <Text style={[styles.text, {color: props.textColour}]}>{props.nativeText}</Text>
                    </View>
                    <View style={[styles.foreignBox, {borderColor: props.borderColour}]}>
                        <Text style={[styles.subtext, {color: props.textColour}]}>{props.foreignText}</Text>
                    </View>
                </View>
                ) : (
                <View style={styles.cardTextContainer}>
                    <View>
                        <Text style={[styles.text, {color: props.textColour}]}>{props.nativeText}</Text>
                    </View>
                </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    renderCardContainer: {
        flex: 1,
        borderRadius: 15,
        alignItems: 'center',
        width: '100%',
        height: '100%',
        marginVertical: 50,
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