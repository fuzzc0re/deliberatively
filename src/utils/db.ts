import { openDB, DBSchema, IDBPDatabase } from "idb";

import { IVoteMarket } from "../models/VoteMarket";
import { IVoteParticipant } from "../models/VoteParticipant";
import { IVoteAlternative } from "../models/VoteAlternative";

interface DeliberativelyDB extends DBSchema {
  voteMarkets: {
    key: string;
    value: IVoteMarket;
  };

  voteParticipants: {
    key: string;
    value: IVoteParticipant;
  };

  voteAlternatives: {
    key: string;
    value: IVoteAlternative;
  };
}

export const sha256 = async (message: string): Promise<string> => {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

  return hashHex;
};

export const getDB = async (): Promise<IDBPDatabase<DeliberativelyDB>> => {
  return await openDB<DeliberativelyDB>("deliberatively-db", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("voteMarkets")) {
        db.createObjectStore("voteMarkets", {
          keyPath: "hash",
        });
      }

      if (!db.objectStoreNames.contains("voteParticipants")) {
        db.createObjectStore("voteParticipants", {
          keyPath: "hash",
        });
      }

      if (!db.objectStoreNames.contains("voteAlternatives")) {
        db.createObjectStore("voteAlternatives", {
          keyPath: "hash",
        });
      }
    },
  });
};

export const getItem = async (
  tableName: "voteMarkets" | "voteParticipants" | "voteAlternatives",
  hash: string
): Promise<IVoteMarket | IVoteParticipant | IVoteAlternative | undefined> => {
  const db = await getDB();
  const tx = db.transaction(tableName, "readonly");
  const store = tx.objectStore(tableName);
  const result = await store.get(hash);

  return result;
};

export const getAllItems = async (
  tableName: "voteMarkets" | "voteParticipants" | "voteAlternatives"
): Promise<(IVoteMarket | IVoteParticipant | IVoteAlternative)[]> => {
  const db = await getDB();
  const tx = db.transaction(tableName, "readonly");
  const store = tx.objectStore(tableName);
  const result = await store.getAll();

  return result;
};

export const setItem = async (
  tableName: "voteMarkets" | "voteParticipants" | "voteAlternatives",
  value: IVoteMarket | IVoteParticipant | IVoteAlternative
): Promise<void> => {
  const db = await getDB();
  const tx = db.transaction(tableName, "readwrite");
  const store = tx.objectStore(tableName);
  await store.add(value);
};

export const removeItem = async (
  tableName: "voteMarkets" | "voteParticipants" | "voteAlternatives",
  hash: string
): Promise<void> => {
  const db = await getDB();
  const tx = db.transaction(tableName, "readwrite");
  const store = tx.objectStore(tableName);
  const result = await store.get(hash);
  if (!result) {
    console.log("Item with hash " + hash + " not found");
    return;
  }
  await store.delete(hash);
  console.log("Deleted item with hash ", hash);
};
