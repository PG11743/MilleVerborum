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
    //console.log(console.log('listing contents of the sqlite folder: ', sqliteFolder.list()));

    const db = await openDatabaseAsync(DB_NAME, {useNewConnection: true});


    try {
        // 1. Get the exact filename your code just generated so we can open it
        // 2. Define the list of your SQL files containing the 1000 inserts each
        //console.log('about to require inserts...');
        const sqlFiles = [
            // Core/Pre-pop files
            require('../assets/database/pre_pop_database.db'),
            
            // Danish
            require('@/assets/database/danish_inserts.db'),
            require('@/assets/database/danish_letter_inserts.db'),
            
            // Estonian
            require('@/assets/database/estonian_inserts.db'),
            require('@/assets/database/estonian_letter_inserts.db'),
            
            // German
            require('@/assets/database/german_inserts.db'),
            require('@/assets/database/german_letter_inserts.db'),
            
            // Lithuanian
            require('@/assets/database/lithuanian_inserts.db'),
            require('@/assets/database/lithuanian_letter_inserts.db'),
            
            // Russian
            require('@/assets/database/russian_inserts.db'),
            require('@/assets/database/russian_letter_inserts.db'),
            
            // Spanish
            require('@/assets/database/spanish_inserts.db'),
            require('@/assets/database/spanish_letter_inserts.db'),
        ];
        //console.log('finished requiring inserts');

        // 3. Execute the batch inserts inside an exclusive transaction for speed
        await db.withExclusiveTransactionAsync(async () => {
            for (const file of sqlFiles) {
                // Download/resolve the .sql file asset
                const sqlAsset = await Asset.fromModule(file).downloadAsync();

                if (sqlAsset.localUri) {
                    const sqlFile = new File(sqlAsset.localUri);
                    const sqlContent = await sqlFile.text();
                    //console.log('sql content: ');
                    //console.log(sqlContent);
                    await db.execAsync(sqlContent);
                }
            }
        });

        console.log("All batch inserts completed successfully!");
    } catch (error) {
        console.error("Error during batch insert step:", error);
    }

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