import { openDB } from "idb";

const DB_NAME = "form-database";
const DB_VERSION = 1;
const STORE_NAME = "form";

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: "Message" });
    }
  },
});

// export async function addForm(data) {
//   // Ensure data is an object
//   if (typeof data === "string") {
//     try {
//       data = JSON.parse(data);
//     } catch (e) {
//       console.error("Invalid JSON string passed to addForm");
//       return;
//     }
//   }

//   const db = await dbPromise;
//   const tx = db.transaction(STORE_NAME, "readwrite");
//   const store = tx.objectStore(STORE_NAME);
//   await store.add(data);
//   await tx.done;
// }

export async function addForm(data) {
  data = JSON.parse(data);

  if (!data.Message) {
    // Auto-generate if Message is missing
    data.Message = `msg_${Date.now()}`;
  }

  const db = await dbPromise;
  const tx = db.transaction(STORE_NAME, "readwrite");
  await tx.store.add(data);
  await tx.done;

  return data.Message; // return the key so caller can reuse it
}


export async function getForm(message) {
  if (!message) {
    console.error("getForm called without a valid message key");
    return null;
  }

  const db = await dbPromise;
  const tx = db.transaction(STORE_NAME, "readonly");
  const store = tx.objectStore(STORE_NAME);
  return await store.get(message);
}

export async function updateForm(data) {
  // Ensure data is an object
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch (e) {
      console.error("Invalid JSON string passed to updateForm");
      return;
    }
  }

  if (!data.Message) {
    throw new Error("Data must include 'Message' as the key.");
  }

  const db = await dbPromise;
  const tx = db.transaction(STORE_NAME, "readwrite");
  await tx.store.put(data); // works only if data.Message exists
  await tx.done;
}

export async function deleteForm(message) {
  if (!message) {
    console.error("deleteForm called without a valid message key");
    return;
  }

  const db = await dbPromise;
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  await store.delete(message);
  await tx.done;
}
