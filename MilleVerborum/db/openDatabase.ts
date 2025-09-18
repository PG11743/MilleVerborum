// openDatabase.ts
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import { openDatabaseAsync, SQLiteDatabase } from 'expo-sqlite';

const DB_NAME = 'milleverborum.db';

// A temp solution for resetting the database. Something more clean will be needed eventually
const wipeFlag = false;

export async function openLanguageDatabase(): Promise<SQLiteDatabase> {
    // console.log('entered async function openLanguageDatabase...');
    const sqliteFolder = `${FileSystem.documentDirectory}SQLite`;
    const dbPath = `${sqliteFolder}/${DB_NAME}`;
    // console.log('dbPath is said to be: ', dbPath);
    const fileInfo = await FileSystem.getInfoAsync(dbPath);
    if (!fileInfo.exists || wipeFlag) {
        const asset = Asset.fromModule(require('@/assets/database/milleverborum.db'));

        await asset.downloadAsync();

        // Ensure SQLite folder exists
        await FileSystem.makeDirectoryAsync(sqliteFolder, { intermediates: true });

        // Copy the downloaded DB to the SQLite folder
        await FileSystem.copyAsync({
            from: asset.localUri!,
            to: dbPath,
        });
    }
                

    return await openDatabaseAsync(DB_NAME, {useNewConnection: true});
    // return await openDatabaseAsync(dbPath.replace('file://', ''));
}
