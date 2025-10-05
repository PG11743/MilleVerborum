import { Asset } from 'expo-asset';
import { File, Directory, Paths } from 'expo-file-system';
import { openDatabaseAsync, SQLiteDatabase } from 'expo-sqlite';

const DB_NAME = 'milleverborum.db';

// A temp solution for resetting the database. Something more clean will be needed eventually
const wipeFlag = false;

async function loadPrebuiltDatabase(sqliteFolder: Directory) {
    const asset = Asset.fromModule(require('@/assets/database/milleverborum.db'));

    sqliteFolder.create();

    await asset.downloadAsync();

    const fileAsset = new File (asset.localUri ?? "");
    const fileDest = new File (sqliteFolder, asset.name + '.' + asset.type);

    fileAsset.copy(fileDest);
    console.log(console.log('listing contents of the sqlite folder: ', sqliteFolder.list()));

}

export async function openLanguageDatabase(): Promise<SQLiteDatabase> {
    const sqliteFolder = new Directory(Paths.document, 'SQLite');
    let foundDBFlag: boolean = false;

    if (wipeFlag) {
        console.log('Wipe Flag activated, wiping DB');
        sqliteFolder.delete();
        await loadPrebuiltDatabase(sqliteFolder);
    }

    if (sqliteFolder.exists) {
        for (const file of sqliteFolder.list()) {
            
            if (((new File(file.name)).name).includes('milleverborum.db')) {
                foundDBFlag = true;
            }
        }
    } else {
        sqliteFolder.create();
    }

    if (!foundDBFlag) {
        console.log('did not find local DB');
        sqliteFolder.delete();
        await loadPrebuiltDatabase(sqliteFolder);
    }


    return await openDatabaseAsync(DB_NAME, {useNewConnection: true});
}