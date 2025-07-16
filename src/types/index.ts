export interface Config {
  from: string;
  to: string;
}

export interface VocabEntry {
  vocab: string;
  from: string;
  to: string;
  url: string | null;
}

export interface VocabStorage {
  [timestamp: string]: VocabEntry;
}

export interface ChromeStorage {
  config?: Config;
  vocabs?: VocabStorage;
}

export interface ContextMenuInfo {
  selectionText?: string;
}

export interface Tab {
  url?: string;
}