import { StyleSheet, Text, View } from 'react-native';

type Props = {
    nativeText :    string,
    foreignText?:    string
};

export default function Card ({nativeText, foreignText} : Props) {
    return (
        <View style={styles.renderCardContainer}>
            {foreignText ? (
            <View style={styles.cardTextContainer}>
                <View>
                    <Text style={styles.text}>{nativeText}</Text>
                </View>
                <View style={styles.foreignBox}>
                    <Text style={styles.subtext}>{foreignText}</Text>
                </View>
            </View>
            ) : (
            <View style={styles.cardTextContainer}>
                <View>
                    <Text style={styles.text}>{nativeText}</Text>
                </View>
            </View>
            )}
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
        backgroundColor: '#fff',
        paddingTop: 200
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
        flex: 1,
        alignItems: 'center',
        borderTopWidth: 2,
        borderColor: 'black',
        paddingTop: 20,
        marginTop: 20,
        width: 100
    },
    text:   {
        fontSize: 40
    },
    subtext:    {
        fontSize: 20
    }
});