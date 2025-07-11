// openDatabase.ts
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import { openDatabaseAsync, SQLiteDatabase } from 'expo-sqlite';

const DB_NAME = 'milleverborum.db';

export async function openLanguageDatabase(): Promise<SQLiteDatabase> {
  // console.log('entered async function openLanguageDatabase...');
  const sqliteFolder = `${FileSystem.documentDirectory}SQLite`;
  const dbPath = `${sqliteFolder}/${DB_NAME}`;

  // TEMP: Force deletion of any existing bad DB

  // try {
  //   const tempfileInfo = await FileSystem.getInfoAsync(dbPath);

  //   console.log('Exists:', tempfileInfo.exists);
  //   console.log('Is Directory:', tempfileInfo.isDirectory);
  //   console.log('URI:', tempfileInfo.uri);

  //   if (tempfileInfo.exists) {
  //     // console.log('Deleting old DB...');
  //     // await FileSystem.deleteAsync(dbPath, { idempotent: true });

  //     // const checkfileInfo = await FileSystem.getInfoAsync(dbPath);
  //     // if (!checkfileInfo) {
  //     //   console.log('file successfully deleted!');
  //     // } else {
  //     //   console.warn('file stil exists!');
  //     // }

  //     try {
  //         // Delete the entire SQLite directory (including the DB file)
  //         const dirInfo = await FileSystem.getInfoAsync(sqliteFolder);
  //         console.log('printing contents of pre-deletion...');
  //         console.log(await FileSystem.readDirectoryAsync(sqliteFolder));
  //         if (dirInfo.exists) {
  //           console.log('Deleting SQLite directory...');
  //           await FileSystem.deleteAsync(sqliteFolder, { idempotent: true });
  //         }

  //         // Recreate the SQLite directory
  //         console.log('Recreating SQLite directory...');
  //         await FileSystem.makeDirectoryAsync(sqliteFolder, { intermediates: true });

  //         // Optionally verify
  //         const check = await FileSystem.getInfoAsync(sqliteFolder);
  //         console.log('Directory exists after recreation:', check.exists);
  //         console.log('printing contents of POST-deletion...');
  //         console.log(await FileSystem.readDirectoryAsync(sqliteFolder));

  //       } catch (error) {
  //         console.error('Failed to reset SQLite directory:', error);
  //       }
  //     }
  //   } catch (error) {
  //     console.error('error deleting file: ', error);
  //   }

  // const fileInfo = await FileSystem.getInfoAsync(dbPath);
  // console.log('printing size...');
  // console.log((fileInfo as any).size);
  // if (!fileInfo.exists) {
  //   console.log('Copying prebuilt database...');
    const asset = Asset.fromModule(require('@/assets/database/milleverborum.db'));

    await asset.downloadAsync();

    // Ensure SQLite folder exists
    await FileSystem.makeDirectoryAsync(sqliteFolder, { intermediates: true });

    
    // console.log('asset file URI: ', asset.uri);
    // console.log('asset localURI: ', asset.localUri);

    // Copy the downloaded DB to the SQLite folder
    await FileSystem.copyAsync({
      from: asset.localUri!,
      to: dbPath,
    });

    // try {
    //     const content = await FileSystem.readAsStringAsync(dbPath, { encoding: FileSystem.EncodingType.Base64 });
    //     console.log('File content length (base64):', content.length);
    // } catch (e) {
    //     console.error('Error reading file:', e);
    // }
  // } else {
  //   console.log('Prebuilt DB already exists.');
  // }

  // console.log('Opening DB at:', dbPath);
  // const cleanPath = dbPath.replace('file://', '');
  // console.log('cleaned path to remove the file prefix. Now it is: ', cleanPath);
  // const db = await openDatabaseAsync(DB_NAME);

  // const result = await db.getAllAsync("SELECT name FROM sqlite_master WHERE type='table';");
  // console.log('Tables in DB:', result);

  return await openDatabaseAsync(DB_NAME);
}
