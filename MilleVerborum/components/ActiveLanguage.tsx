import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

type Item = {
    id:         number;
    title:      string;
};

type Props = {
    item:       Item;
    onDelete:   (id: number) => void;
}

export default function ActiveLanguage({item, onDelete} : Props) {
    const router = useRouter();

    const renderRightActions = () => (
        <TouchableOpacity
            style={styles.deleteAction}
            onPress={() => onDelete(item.id)}
        >
            <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
    );

    const pressAction = () => {
        router.push('/StagingScreen');
    };

    return (
        <Swipeable renderRightActions={renderRightActions}>
            <Pressable onPress={pressAction} style={styles.itemContainer}>
                <Text>{item.title}</Text>
            </Pressable>
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