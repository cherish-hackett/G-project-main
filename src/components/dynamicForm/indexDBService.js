import { openDB } from 'idb';
// import { stringify } from 'postcss';

const DB_NAME = 'form-database';
const DB_VERSION = 1;
const STORE_NAME = 'form';

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: 'Message' });
    }
  },
});

export async function addForm(data) {
  data = JSON.parse(data);
  const db = await dbPromise;
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  await store.add(data);
  await tx.done;
}

export async function getForm(message) {
  const db = await dbPromise;
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  return await store.get(message);
}

export async function updateForm(data) {
  data = JSON.parse(data);
  const db = await dbPromise;
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  await store.put(data); // No key parameter
  await tx.done;
}

export async function deleteForm(message) {
  const db = await dbPromise;
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  await store.delete(message);
  await tx.done;
}






// // import { openDB } from 'idb';

// // const DB_NAME = 'FormDB';
// // const DB_VERSION = 1;
// // const STORE_NAME = 'formData';

// // async function initDB() {
// //   return openDB(DB_NAME, DB_VERSION, {
// //     upgrade(db) {
// //       if (!db.objectStoreNames.contains(STORE_NAME)) {
// //         db.createObjectStore(STORE_NAME, { keyPath: 'tabId' });
// //       }
// //     }
// //   });
// // }

// // export async function storeFormData(tabId, formData) {
// //     console.log("55");
// //   const db = await initDB();
// //   // Serialize the formData object
// //   const tx = db.transaction(STORE_NAME, 'readwrite');
// //   const serializableFormData = JSON.parse(JSON.stringify(formData));
// //   const store = tx.objectStore(STORE_NAME);
// //   console.log(serializableFormData);
// //   console.log(tabId);
// //   await store.put({ tabId, formData: serializableFormData });
// // }

// // export async function getFormData(tabId) {
// //   const db = await initDB();
// //   return db.get(STORE_NAME, tabId);
// // }

// import { openDB } from "idb";

// // Database name and version
// const dbName = "FormDataDB";
// const imageDBName = "ImageDataDB";
// const dbVersion = 1;

// // Create or open the database and object stores
// async function initDB() {
//   const db = await openDB(dbName, dbVersion, {
//     upgrade(db) {
//       if (!db.objectStoreNames.contains("formData")) {
//         db.createObjectStore("formData", { keyPath: "tabId" });
//       }
//     },
//   });

//   const imageDB = await openDB(imageDBName, dbVersion, {
//     upgrade(imageDB) {
//       if (!imageDB.objectStoreNames.contains("imageData")) {
//         imageDB.createObjectStore("imageData", { keyPath: "Key" });
//       }
//     },
//   });

//   return { db, imageDB };
// }

// // Store form data in IndexedDB
// export async function storeFormData(tabId, formData) {
//   const { db } = await initDB();
//   // Remove non-serializable data before storing
//   const serializableFormData = JSON.parse(JSON.stringify(formData));
//   await db.put("formData", { tabId, formData: serializableFormData });
// }

// // Retrieve form data from IndexedDB
// export async function getFormData(tabId) {
//   const { db } = await initDB();
//   return await db.get("formData", tabId);
// }

// // Store image data in IndexedDB
// export async function storeImageData(imageId, imageData) {
//   const { imageDB } = await initDB();
//   const tx = imageDB.transaction("imageData", 'readwrite');
//   const store = tx.objectStore("imageData");
//   const serializableFormData = JSON.parse(JSON.stringify(imageData));
//   console.log(imageId);
//   console.log(serializableFormData);
//   await store.add({ key:imageId, value:serializableFormData });
//   await tx.done;
// }

// // Retrieve image data from IndexedDB
// export async function getImageData(imageId) {
//   const { imageDB } = await initDB();
//   return await imageDB.get("imageData", imageId);
// }
