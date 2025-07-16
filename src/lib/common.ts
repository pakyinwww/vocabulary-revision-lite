import { Config, VocabStorage, ChromeStorage } from '../types';

const defaultFrom = 'en';
const defaultTo = 'zh-TW';

export const getTranslateFromTo = () => {
  const from = document.getElementById('from');
  const to = document.getElementById('to');

  if (! (from instanceof HTMLSelectElement)) {
    throw new Error("Unexpected result from HTMLSelectElement");
  }

  if (! (to instanceof HTMLSelectElement)) {
    throw new Error("Unexpected result from HTMLSelectElement");
  }

  return {from, to};
};

export const getImportFile = () => {
  const file = document.getElementById('selectedFile');

  if (! (file instanceof HTMLInputElement)) {
    throw new Error("Unexpected result from HTMLSelectElement");
  }

  return file;
};

export const getConfig = async (): Promise<Config> => {
  // 1. retrieve config if any
  const config = await retrieve('config') as Config | undefined;
  // 2. if config exists, return it
  if (config) {
    return config;
  }
  // 3. if config doesn't exist, construct a new one.
  await saveConfig('from', defaultFrom);
  await saveConfig('to', defaultTo);
  return { from: defaultFrom, to: defaultTo };
};

export const getVocabs = async (): Promise<VocabStorage | undefined> => {
  return await retrieve('vocabs') as VocabStorage | undefined;
};

export const saveConfig = async (key: keyof Config, value: string): Promise<void> => {
  const all = await retrieveAll();
  if (!all.config || Object.keys(all.config).length === 0) {
    all.config = { from: defaultFrom, to: defaultTo };
  }
  all.config[key] = value;
  await new Promise<void>(resolve => chrome.storage.local.set(all, () => {
    resolve();
  }));
};

export const saveVocab = async (id: string | null, vocab: string, from: string, to: string, url: string | null): Promise<void> => {
  const all = await retrieveAll();
  if (!all.vocabs || Object.keys(all.vocabs).length === 0) {
    all.vocabs = {};
  }
  const timestamp = id || Date.now();
  all.vocabs[timestamp] = { vocab, from, to, url: url.indexOf('chrome://') > -1 ? null : url };
  await new Promise<void>(resolve => chrome.storage.local.set(all, () => {
    resolve();
  }));
};

export const deleteVocab = async (id: string): Promise<void> => {
  const all = await retrieveAll();
  if (!all.vocabs || Object.keys(all.vocabs).length === 0) {
    return;
  }
  delete all.vocabs[id];
  await new Promise<void>(resolve => chrome.storage.local.set(all, () => {
    resolve();
  }));
};

export const retrieve = async (key: string): Promise<any> => {
  const value = await new Promise(resolve => chrome.storage.local.get(key,
    (obj) => {
      resolve(obj[key]);
    })
  );
  return cloneDeep(value);
};

export const retrieveAll = async (): Promise<ChromeStorage> => {
  const all = await new Promise(resolve => chrome.storage.local.get(null,
    (obj) => {
      resolve(obj);
    })
  );
  return cloneDeep(all);
};

export const cloneDeep = <T>(obj: T): T =>
  obj ? JSON.parse(JSON.stringify(obj)) : obj;
