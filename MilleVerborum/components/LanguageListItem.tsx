import { openLanguageDatabase } from '@/db/openDatabase';
import { LangRowType } from '@/types';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

type Props = | {
    activeOnly: true;
    item:       LangRowType;
    setActiveLoading:           React.Dispatch<React.SetStateAction<boolean>>;
    setAlphabetVisibility:      React.Dispatch<React.SetStateAction<boolean>>;
} | {
    activeOnly: false;
    item:       LangRowType;
    setModalVisibility:         React.Dispatch<React.SetStateAction<boolean>>;
    setInactiveLoading:         React.Dispatch<React.SetStateAction<boolean>>;
}

async function addActiveLanguage (
    item:                   LangRowType,
    setInactiveLoading:     React.Dispatch<React.SetStateAction<boolean>>,
) {
    setInactiveLoading(true);
    try{
        const db = await openLanguageDatabase();
        const updateLanguageStatement = await db.prepareAsync('UPDATE languages SET curr_level = 1 WHERE lang_id = $lang_id');
        const result = await updateLanguageStatement.executeAsync({$lang_id: item.lang_id});
        await updateLanguageStatement.finalizeAsync();

        // console.log('result of adding language is: ');
        // console.log(result);

        // const result = await db.getAllAsync("SELECT lang_id, lang_name FROM languages where curr_level IS NOT NULL;");
        // setLanguages(result);
        // setLoading(false);
    } catch (error) {
        console.error("DB failed to open", error);
    }
    setInactiveLoading(false);    
};


async function deactiveLanguage (
    item:                   LangRowType,
    setActiveLoading:       React.Dispatch<React.SetStateAction<boolean>>
) {
    setActiveLoading(true);
    try{
        const db = await openLanguageDatabase();
        const updateLanguageStatement = await db.prepareAsync('UPDATE languages SET curr_level = null WHERE lang_id = $lang_id');
        const result = await updateLanguageStatement.executeAsync({$lang_id: item.lang_id});
        await updateLanguageStatement.finalizeAsync();

        // console.log('result of deactivating language is: ');
        // console.log(result);

        // const result = await db.getAllAsync("SELECT lang_id, lang_name FROM languages where curr_level IS NOT NULL;");
        // setLanguages(result);
        // setLoading(false);
    } catch (error) {
        console.error("DB failed to open", error);
    }
}


export default function LanguageListItem(props : Props) {
    const router = useRouter();

    return (
        <View>
            {props.activeOnly ? (
                <Swipeable renderRightActions={() =>(
                    <TouchableOpacity
                        style={styles.deleteAction}
                        onPress={() => deactiveLanguage(props.item, props.setActiveLoading)}
                    >
                        <FontAwesome name="trash" size={30} color="#ffffff"/>
                    </TouchableOpacity>
                    )}
                    renderLeftActions={() =>(
                    <TouchableOpacity
                        style={styles.alphabetAction}
                        onPress={() => 
                            //deactiveLanguage(props.item, props.setActiveLoading)
                            props.setAlphabetVisibility(true)
                        }
                    >
                        <MaterialCommunityIcons name="alphabet-greek" size={30} color="#ffffff" />
                    </TouchableOpacity>
                    )}
                >
                    <Pressable onPress={() => {router.push({pathname: '/StagingScreen', params: {lang_id: props.item.lang_id}});}} style={styles.activeItemContainer}>
                        <Text>{props.item.lang_name}</Text>
                    </Pressable>
                </Swipeable>
            ) : (
                <Pressable onPress={
                    async () =>{
                        await addActiveLanguage(
                            props.item,
                            props.setInactiveLoading
                        );
                        props.setModalVisibility(false);
                    }} 
                    style={styles.unactiveItemContainer}
                >
                    <Text>{props.item.lang_name}</Text>
                </Pressable>
            )}

        </View>
    );
}

const styles = StyleSheet.create({
  activeItemContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 2,
    borderRadius: 10
  },
unactiveItemContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderColor: '#d3d2d2ff'
  },
  deleteAction: {
    backgroundColor: '#ff3b30',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    marginBottom: 2,
    borderRadius: 10
  },
  alphabetAction: {
    backgroundColor: '#12e34a',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    marginBottom: 2,
    borderRadius: 10
  },
  actionText: {
    color: 'white',
    marginTop: 4,
  }
});