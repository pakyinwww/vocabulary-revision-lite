import { getConfig, saveVocab } from '../lib/common';
import { ContextMenuInfo } from '../types';

export const createMenu = (): void => {
  chrome.contextMenus.create({
    type: 'normal',
    contexts: ['selection'],
    title: 'Translate "%s"',
    id: 'vocabulary-revision-lite'
  });
};

export const addMenuEventListeners = (): void => {
  chrome.contextMenus.onClicked.addListener(
    async (info: ContextMenuInfo) => {
      const text = info.selectionText;
      
      if (!text) return;

      const config = await getConfig();

      const tabs = await new Promise<chrome.tabs.Tab[]>(resolve => 
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, resolve)
      );
      
      const currentUrl = tabs[0]?.url || null;

      await saveVocab(null, text, config.from, config.to, currentUrl);

      chrome.tabs.create({
        url: `https://translate.google.com/?sl=${config.from}&tl=${config.to}&text=${encodeURIComponent(text)}&op=translate`
      });
    }
  );
};
