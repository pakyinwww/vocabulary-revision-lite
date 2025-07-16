import { refreshConfig } from './config';
import { refreshVocabTable } from './vocab-table';

export const resetAllData = async (): Promise<void> => {
    const isExecuted = confirm('The action clears all vocabularies. Are you sure?');
    if (isExecuted) {
        chrome.storage.local.clear();
        await refreshConfig();
        await refreshVocabTable();
    }
};

export const addResetListener = (): void => {
    const btnReset = document.getElementById('btnReset');
    if (btnReset) {
        btnReset.addEventListener('click', resetAllData);
    }
};