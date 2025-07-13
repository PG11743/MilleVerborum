import { openLanguageDatabase } from '@/db/openDatabase';
import { LangRowType } from '@/types';
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
    setModalVisibility:         React.Dispatch<React.SetStateAction<boolean>>;
    setInactiveLanguages:       React.Dispatch<React.SetStateAction<LangRowType[]>>;
    setInactiveLoading:         React.Dispatch<React.SetStateAction<boolean>>;
    getInactiveLanguages: (
        setInactiveLanguages:   React.Dispatch<React.SetStateAction<LangRowType[]>>,
        setInactiveLoading:     React.Dispatch<React.SetStateAction<boolean>>
    ) => Promise<void>;
    setActiveLanguages:         React.Dispatch<React.SetStateAction<LangRowType[]>>;
    setActiveLoading:           React.Dispatch<React.SetStateAction<boolean>>;
    getActiveLanguages: (
        setActiveLanguages:     React.Dispatch<React.SetStateAction<LangRowType[]>>,
        setActiveLoading:       React.Dispatch<React.SetStateAction<boolean>>
    ) => Promise<void>;
}

async function addActiveLanguage (
    item: Item,
    getInactiveLanguages: (
        setInactiveLanguages:   React.Dispatch<React.SetStateAction<LangRowType[]>>,
        setInactiveLoading:     React.Dispatch<React.SetStateAction<boolean>>
    ) => Promise<void>,
    setInactiveLanguages:       React.Dispatch<React.SetStateAction<LangRowType[]>>,
    setInactiveLoading:         React.Dispatch<React.SetStateAction<boolean>>,
    getActiveLanguages: (
        setActiveLanguages:   React.Dispatch<React.SetStateAction<LangRowType[]>>,
        setActiveLoading:     React.Dispatch<React.SetStateAction<boolean>>
    ) => Promise<void>,
    setActiveLanguages:       React.Dispatch<React.SetStateAction<LangRowType[]>>,
    setActiveLoading:         React.Dispatch<React.SetStateAction<boolean>>
) {
    setInactiveLoading(true);
    try{
        const db = await openLanguageDatabase();
        const updateLanguageStatement = await db.prepareAsync('UPDATE languages SET curr_level = 1 WHERE lang_id = $lang_id');
        const result = await updateLanguageStatement.executeAsync({$lang_id: item.id});
        await updateLanguageStatement.finalizeAsync();

        console.log('result of adding language is: ');
        console.log(result);

        await getInactiveLanguages(setInactiveLanguages, setInactiveLoading);
        await getActiveLanguages(setActiveLanguages, setActiveLoading);
        // const result = await db.getAllAsync("SELECT lang_id, lang_name FROM languages where curr_level IS NOT NULL;");
        // setLanguages(result);
        // setLoading(false);
    } catch (error) {
        console.error("DB failed to open", error);
    }
    setInactiveLoading(false);    
};

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
                <Pressable onPress={
                    async () =>{
                        await addActiveLanguage(
                            props.item,
                            props.getInactiveLanguages,
                            props.setInactiveLanguages,
                            props.setInactiveLoading,
                            props.getActiveLanguages,
                            props.setActiveLanguages,
                            props.setActiveLoading
                        );
                        props.setModalVisibility(false);
                    }} 
                    style={styles.itemContainer}
                >
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