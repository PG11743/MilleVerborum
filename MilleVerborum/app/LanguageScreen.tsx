import ActiveLanguage from '@/components/ActiveLanguage';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

export default function LanguageScreen() {
    return (
        <GestureHandlerRootView>
            <ScrollView style={styles.scrollBox}>
                <ActiveLanguage item={{id: '123', title: 'Danish'}} onDelete={(id: string)=>{}}/>
            </ScrollView>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    scrollBox: {
        borderWidth: 2
    }
});