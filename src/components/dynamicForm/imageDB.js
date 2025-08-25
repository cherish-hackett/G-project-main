import { openDB } from "idb";

const DB_NAME = "image-database";
const DB_VERSION = 1;
const STORE_NAME = "images";

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      const store = db.createObjectStore(STORE_NAME, {
        keyPath: ["fieldInd", "tabId"],
      });
      store.createIndex("fieldInd", "fieldInd", { unique: false });
      store.createIndex("tabId", "tabId", { unique: false });
      store.createIndex("fieldInd_tabId", ["fieldInd", "tabId"], {
        unique: true,
      });
    }
  },
});

export async function addImage(file, fieldInd, fieldIndex, tabId, fieldName) {
  try {
    const db = await dbPromise;
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const obj = {
      file: file,
      fieldInd: fieldIndex,
      tabId: tabId,
      field: fieldInd,
      fieldType: "IMAGE",
      fieldName: fieldName,
    };
    await store.put(obj);
    await tx.done;
  } catch (error) {
    console.error("Add image error:", error);
  }
}

export async function getImage(fieldInd, tabId) {
  try {
    const db = await dbPromise;
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    return await store.get([fieldInd, tabId]);
  } catch (error) {
    console.error("Get image error:", error);
  }
}

export async function getImages() {
  try {
    const db = await dbPromise;
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    return await store.getAll();
  } catch (error) {
    console.error("Get images error:", error);
  }
}

export async function updateImage(image) {
  try {
    const db = await dbPromise;
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    await store.put(image);
    await tx.done;
  } catch (error) {
    console.error("Update image error:", error);
  }
}

export async function deleteImage(fieldInd, tabId) {
  try {
    const db = await dbPromise;
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    await store.delete([fieldInd, tabId]);
    await tx.done;
  } catch (error) {
    console.error("Delete image error:", error);
  }
}

export async function getImagesByFieldInd(fieldInd) {
  try {
    const db = await dbPromise;
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const index = store.index("fieldInd");
    return await index.getAll(fieldInd);
  } catch (error) {
    console.error("Get images by fieldInd error:", error);
  }
}

export async function getImagesByTabId(tabId) {
  try {
    const db = await dbPromise;
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const index = store.index("tabId");
    return await index.getAll(tabId);
  } catch (error) {
    console.error("Get images by tabId error:", error);
  }
}

export async function getImageByFieldIndAndTabId(fieldInd, tabId) {
  try {
    const db = await dbPromise;
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const index = store.index("fieldInd_tabId");
    return await index.get([fieldInd, tabId]);
  } catch (error) {
    console.error("Get image by fieldInd and tabId error:", error);
  }
}
