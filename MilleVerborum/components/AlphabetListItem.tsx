import { openLanguageDatabase } from '@/db/openDatabase';
import { LangRowType } from '@/types';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

type Props = {
    letterSymbol:   string;
    pronunciation:  string;
    explanation:    string;
}

export default function AlphabetListItem(props : Props) {
    const router = useRouter();

    return (
        <View style={styles.letterContainer}>
            <View style={styles.pronuciationContainer}>
                <View style={styles.letterSymbol}>
                    <Text style={styles.letterSymbolText}>
                        {props.letterSymbol}
                    </Text>
                </View>
                <View style={styles.letterPronunciation}>
                    <Text style={styles.letterPronunciationText}>
                        {props.pronunciation}
                    </Text>
                </View>
            </View>
            <View>
                <Text style={styles.explanationText}>
                    {props.explanation}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
  letterContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#d3d2d2ff'
  },
  pronuciationContainer: {
    flexDirection: 'row',
    marginBottom: 5
  },
  letterSymbol: {
    flex: 1
  },
  letterSymbolText: {
    fontSize: 28
  },
  letterPronunciation: {
    flex: 1
  },
  letterPronunciationText: {
    textAlign: 'right',
    fontSize: 28
  },
  explanationText: {
    textAlign: 'center',
    fontWeight: 'bold'
  }
});