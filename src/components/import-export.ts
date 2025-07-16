import { getVocabs, saveVocab, getImportFile } from '../lib/common';
import { refreshVocabTable } from './vocab-table';
import { withErrorHandling, AppError } from '../utils/error-handler';

export const exportCSV = withErrorHandling(async (): Promise<void> => {
    const vocabs = await getVocabs();

    if (!vocabs || Object.keys(vocabs).length <= 0) {
        throw new AppError('No vocabulary can be exported.');
    }

    const universalBOM = '\uFEFF';
    const csvHeader = 'data:text/csv; charset=utf-8,' + encodeURIComponent(universalBOM);
    const csvContent = Object.keys(vocabs)
        .map((key) => `${key},${new Date(+key).toLocaleDateString()},${vocabs[key].vocab},${vocabs[key].from},${vocabs[key].to},${vocabs[key].url || ''}\n`)
        .join('');

    const link = document.createElement('a');
    link.setAttribute('href', csvHeader + csvContent);
    link.setAttribute('download', `vocab_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}, 'Failed to export vocabulary');

export const importCSV = (): void => {
    const fileInput = document.getElementById('selectedFile');
    if (fileInput) {
        fileInput.click();
    }
};

export const readFile = withErrorHandling(async (): Promise<void> => {
    const fileInput = getImportFile();
    const file = fileInput.files?.[0];
    
    if (!file) {
        throw new AppError('No file selected');
    }

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = async () => {
            try {
                const result = reader.result;
                
                if (typeof result !== 'string') {
                    throw new AppError("Invalid file format");
                }
                
                const lines = result.split('\n').filter(line => line.trim());
                
                for (const line of lines) {
                    const split = line.split(',');
                    if (split && split.length >= 5) {
                        const [time, , vocab, from, to, url = ''] = split;
                        await saveVocab(time, vocab, from, to, url || null);
                    } else {
                        throw new AppError('Invalid CSV format. Please check your file.');
                    }
                }
                
                await refreshVocabTable();
                resolve();
            } catch (error) {
                reject(error);
            }
        };
        
        reader.onerror = () => reject(new AppError('Failed to read file'));
        reader.readAsText(file, 'ISO-8859-1');
    });
}, 'Failed to import vocabulary file');

export const addImportExportListeners = (): void => {
    const btnExport = document.getElementById('btnExport');
    const btnImport = document.getElementById('btnImport');
    const selectedFile = document.getElementById('selectedFile');

    if (btnExport) {
        btnExport.addEventListener('click', exportCSV);
    }

    if (btnImport) {
        btnImport.addEventListener('click', importCSV);
    }

    if (selectedFile) {
        selectedFile.addEventListener('change', readFile);
    }
};