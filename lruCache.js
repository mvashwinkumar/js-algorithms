/* eslint-disable no-param-reassign */

// Entry class (inner class)
class Entry {
  constructor(key, value, prevEntry, nextEntry) {
    this.key = key;
    this.val = value;
    this.prevEntry = prevEntry;
    this.nextEntry = nextEntry;
    this.updatedAt = new Date();
  }

  set value(val) {
    this.val = val;
    this.updatedAt = new Date();
  }

  get value() {
    return this.val;
  }
}

// LRUCache class
// constants
const MAX_LRU_SIZE = 100;

// Symbols
const MAX_SIZE = Symbol('maxSize');
const HASH_MAP = Symbol('hashmap');
const START_ENTRY = Symbol('startEntry');
const END_ENTRY = Symbol('endEntry');
const MAX_AGE_SECONDS = Symbol('maxAgeSeconds');
const REMOVE_NODE_FN = Symbol('removeNode');
const ADD_NODE_TO_START_FN = Symbol('addNodeToStart');

// private methods
function constructKey(key) {
  return typeof key === 'object' ? JSON.stringify(key) : `${key}`;
}

function removeNode(entry) {
  if (entry.prevEntry) {
    entry.prevEntry.nextEntry = entry.nextEntry;
  } else {
    this[START_ENTRY] = entry.nextEntry;
  }
  if (entry.nextEntry) {
    entry.nextEntry.prevEntry = entry.prevEntry;
  } else {
    this[END_ENTRY] = entry.prevEntry;
  }
  return entry;
}

function addNodeToStart(entry) {
  entry.prevEntry = null;
  entry.nextEntry = this[START_ENTRY];
  if (this[START_ENTRY]) {
    this[START_ENTRY].prevEntry = entry;
  }
  this[START_ENTRY] = entry;
  if (!this[END_ENTRY]) this[END_ENTRY] = this[START_ENTRY];
}

// class implementation
class LRUCache {
  // using hashmap to store keys
  // using doubly linked list to store values
  constructor(options = {}) {
    this[MAX_SIZE] = options.maxSize || MAX_LRU_SIZE;
    this[HASH_MAP] = new Map();
    this[START_ENTRY] = null;
    this[END_ENTRY] = null;
    this[MAX_AGE_SECONDS] = options.maxAgeSeconds || Infinity;
    this[REMOVE_NODE_FN] = removeNode.bind(this);
    this[ADD_NODE_TO_START_FN] = addNodeToStart.bind(this);
  }

  fetch(key) {
    const k = constructKey(key);
    if (this[HASH_MAP].has(k)) {
      const entry = this[HASH_MAP].get(k);
      this[REMOVE_NODE_FN](entry);
      const entryAgeSeconds = (new Date() - entry.updatedAt) / 1000;
      if (entryAgeSeconds < this[MAX_AGE_SECONDS]) {
        this[ADD_NODE_TO_START_FN](entry);
      } else {
        this[HASH_MAP].delete(entry.key);
      }
      return entry.value;
    }
    return null;
  }

  put(key, value) {
    const k = constructKey(key);
    if (this[HASH_MAP].has(k)) {
      const entry = this[HASH_MAP].get(k);
      entry.value = value;
      this[REMOVE_NODE_FN](entry);
      this[ADD_NODE_TO_START_FN](entry);
    } else {
      const newEntry = new Entry(k, value, null, null);
      if (this[HASH_MAP].size >= this[MAX_SIZE]) {
        this[HASH_MAP].delete(this[END_ENTRY].key);
        this[REMOVE_NODE_FN](this[END_ENTRY]);
      }
      this[ADD_NODE_TO_START_FN](newEntry);
      this[HASH_MAP].set(k, newEntry);
    }
  }
}

module.exports = LRUCache;
