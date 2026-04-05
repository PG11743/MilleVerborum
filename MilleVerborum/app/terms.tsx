import React, { useCallback } from 'react';
import { ScrollView, View, Text, StyleSheet, Modal } from 'react-native';
import { Pressable } from 'react-native';
import { openLanguageDatabase } from '@/db/openDatabase';
import { UserAgreement } from '@/types';

type Props = {
    isModalVisible: boolean;
    setModalVisibility: React.Dispatch<React.SetStateAction<boolean>>;
    setSignedEULA: React.Dispatch<React.SetStateAction<number>>;
}

async function setUserAgreement (
  setSignedEULA : React.Dispatch<React.SetStateAction<number>>, 
  setAgreementPopup: React.Dispatch<React.SetStateAction<boolean>>
) {
    try{
        const db = await openLanguageDatabase();
        const updateLanguageStatement = await db.prepareAsync('INSERT INTO agreements (type, version) values ("EULA", 1)');
        const result = await updateLanguageStatement.executeAsync();
        await updateLanguageStatement.finalizeAsync();

        setSignedEULA(1);
        setAgreementPopup(false);
        // console.log('result of adding language is: ');
        // console.log(result);

        // const result = await db.getAllAsync("SELECT lang_id, lang_name FROM languages where curr_level IS NOT NULL;");
        // setLanguages(result);
        // setLoading(false);
    } catch (error) {
        console.error("DB failed to open", error);
    }
};

/**
 * MILLE VERBA - END USER LICENSE AGREEMENT (EULA)
 * Structured for React Native Portfolio use.
 */
export default function Terms(props: Props) {  
  return (
    <Modal
      animationType="slide"
      visible={props.isModalVisible}
      style={styles.modalContainer}
    >
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>End User License Agreement</Text>
        <Text style={styles.lastUpdated}>Last Updated: April 05, 2026</Text>

        <View style={styles.section}>
            <Text style={styles.body}>
            This End User License Agreement ("Agreement") is a binding legal agreement between you ("User") and the developer of Mille Verba ("The Licensor"). By installing or using the Mille Verba application ("The App"), you agree to be bound by these terms.
            </Text>
        </View>

        {/* 1. GRANT OF LICENSE */}
        <View style={styles.section}>
            <Text style={styles.heading}>1. Grant of License</Text>
            <Text style={styles.body}>
            The Licensor grants you a personal, non-exclusive, non-transferable, and limited license to install and use the App on mobile devices owned or controlled by you, strictly for your personal, non-commercial educational purposes.
            </Text>
        </View>

        {/* 2. INTELLECTUAL PROPERTY */}
        <View style={styles.section}>
            <Text style={styles.heading}>2. Intellectual Property</Text>
            <Text style={styles.body}>
            The App, including its source code, design, logos, and the curated database of language flashcards, is the intellectual property of The Licensor. This license does not grant you any ownership rights. You may not reverse engineer, decompile, or attempt to extract the source code of the App.
            </Text>
        </View>

        {/* 3. LINGUISTIC ACCURACY DISCLAIMER - CRITICAL SECTION */}
        <View style={styles.section}>
            <Text style={styles.heading}>3. Accuracy of Content</Text>
            <Text style={styles.body}>
            Mille Verba is provided as a <Text style={styles.bold}>study aid only</Text>. While The Licensor strives for linguistic accuracy in the "1000 most common words" database, language is subjective, contextual, and ever-changing. 
            </Text>
            <Text style={styles.body}>
            The Licensor does not warrant that translations, pronunciations, or definitions are 100% accurate or error-free. You acknowledge that any reliance on the content within the App for professional, academic, or travel purposes is at your own risk.
            </Text>
        </View>

        {/* 4. PRIVACY & DATA */}
        <View style={styles.section}>
            <Text style={styles.heading}>4. Privacy & Local Storage</Text>
            <Text style={styles.body}>
            The App utilizes a local SQLite database to store your learning progress. This data remains on your device. The Licensor does not collect, sell, or transmit your personal learning data to external servers. You are responsible for maintaining the security of your device.
            </Text>
        </View>

        {/* 5. LIMITATION OF LIABILITY */}
        <View style={styles.section}>
            <Text style={styles.heading}>5. Limitation of Liability</Text>
            <Text style={styles.body}>
            To the maximum extent permitted by law, The Licensor shall not be liable for any damages arising out of the use or inability to use the App, including but not limited to academic failure, linguistic misunderstandings, or data loss. The App is provided "AS IS" and "AS AVAILABLE."
            </Text>
        </View>

        {/* 6. TERMINATION */}
        <View style={styles.section}>
            <Text style={styles.heading}>6. Termination</Text>
            <Text style={styles.body}>
            This license is effective until terminated by you or The Licensor. Your rights under this license will terminate automatically if you fail to comply with any terms of this Agreement.
            </Text>
        </View>

        {/* 7. CONTACT */}
        <View style={styles.section}>
            <Text style={styles.heading}>7. Contact</Text>
            <Text style={styles.body}>
            For questions regarding this agreement, you may contact the developer via the official repository or support channels provided in the App Store listing.
            </Text>
        </View>
        
        <View style={{ height: 100 }} />
        <View style={styles.aboutContainer}>
          <Pressable style={styles.aboutButton} onPress={useCallback(async () => {
            setUserAgreement(props.setSignedEULA, props.setModalVisibility);
          },[])}>
              <Text style={styles.aboutButtonLabel}>Accept</Text>
          </Pressable>
        </View>
        </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 15
  },
  contentContainer: {
    padding: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 5,
    marginTop: 20,
  },
  lastUpdated: {
    fontSize: 12,
    color: '#888',
    marginBottom: 30,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 25,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  body: {
    fontSize: 14,
    lineHeight: 22,
    color: '#555',
    marginBottom: 10,
  },
  bold: {
    fontWeight: 'bold',
    color: '#000',
  },
  modalContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  aboutContainer: {
      position: 'absolute',
      width: 'auto',
      bottom: 80,
      left: 0,
      right: 0,
      alignContent: 'center'
  },
  aboutButton: {
      alignItems: 'center',
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'center'
  },
  aboutButtonLabel: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#7700ffff'
  }
});