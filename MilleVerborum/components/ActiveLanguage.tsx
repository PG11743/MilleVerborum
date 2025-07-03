import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

type Item = {
    id:         string;
    title:      string;
};

type Props = {
    item:       Item;
    onDelete:   (id: string) => void;
}

export default function ActiveLanguage({item, onDelete} : Props) {
    const renderRightActions = () => (
        <TouchableOpacity
            style={styles.deleteAction}
            onPress={() => onDelete(item.id)}
        >
            <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
    );

    return (
        <Swipeable renderRightActions={renderRightActions}>
            <View style={styles.itemContainer}>
                <Text>{item.title}</Text>
            </View>
        </Swipeable>
    );
}

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  deleteAction: {
    backgroundColor: '#ff3b30',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  actionText: {
    color: 'white',
    marginTop: 4,
  }
});