import { refreshConfig, addConfigListeners } from './config';
import { refreshVocabTable } from './vocab-table';
import { addImportExportListeners } from './import-export';
import { addResetListener } from './reset';

export { refreshConfig, refreshVocabTable };

export const addListeners = (): void => {
    addConfigListeners();
    addResetListener();
    addImportExportListeners();
};
