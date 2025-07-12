import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

type Item = {
    id:         number;
    title:      string;
};

type Props = | {
        activeOnly: true;
        item:       Item;
        onDelete:   (id: number) => void;
    } | {
        activeOnly: false;
        item:       Item;
        setModalVisibility: React.Dispatch<React.SetStateAction<boolean>>;
    }

export default function LanguageListItem(props : Props) {
    const router = useRouter();

    return (
        <View>
            {props.activeOnly ? (
                <Swipeable renderRightActions={() =>(
                    <TouchableOpacity
                        style={styles.deleteAction}
                        onPress={() => props.onDelete(props.item.id)}
                    >
                        <Text style={styles.actionText}>
                            Delete
                        </Text>
                    </TouchableOpacity>
                    )}
                >
                    <Pressable onPress={() => {router.push('/StagingScreen');}} style={styles.itemContainer}>
                        <Text>{props.item.title}</Text>
                    </Pressable>
                </Swipeable>
            ) : (
                <Pressable onPress={() => {props.setModalVisibility(false)}} style={styles.itemContainer}>
                    <Text>{props.item.title}</Text>
                </Pressable>
            )}

        </View>
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