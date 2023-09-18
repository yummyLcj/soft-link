import { message } from 'antd';

let db: any;
let tasks: any[] = [];

const request = indexedDB.open('soft-link', 1);
request.onerror = () => {
  message.error("IndexedBD Error; Why didn't you allow my web app to use IndexedDB?!");
};

request.onupgradeneeded = (event) => {
  // @ts-ignore
  const db = event.target.result;
  const store = db.createObjectStore('directory', { keyPath: 'path' });
  store.createIndex('creatAt', 'creatAt', { unique: false });
};

request.onsuccess = (event) => {
  // @ts-ignore
  db = event.target.result;
  tasks.forEach((task) => {
    task();
  });
};

export const add = (storeName: string, data: Record<string, any>): Promise<any> => {
  const handler = (resolve: any, reject: any) => {
    const store = db!.transaction(storeName, 'readwrite').objectStore(storeName);
    const record = { ...data, createAt: Date.now() };
    const idbRequest = store.add(record);
    idbRequest.onerror = (error: any) => reject(error);
    idbRequest.onsuccess = () => {
      resolve(record);
    };
  };
  return new Promise((resolve, reject) => {
    if (db) {
      handler(resolve, reject);
    } else {
      tasks.push(() => handler(resolve, reject));
    }
  });
};

export const getAll = (storeName: string): Promise<any[]> => {
  const handler = (resolve: any, reject: any) => {
    const store = db!.transaction(storeName, 'readwrite').objectStore(storeName);
    const idbRequest = store.getAll();
    idbRequest.onerror = (error: any) => reject(error);
    idbRequest.onsuccess = (event: any) => {
      resolve(event.target.result);
    };
  };
  return new Promise((resolve, reject) => {
    if (db) {
      handler(resolve, reject);
    } else {
      tasks.push(() => handler(resolve, reject));
    }
  });
};