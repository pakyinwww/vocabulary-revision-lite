import { getVocabs, deleteVocab } from '../lib/common';

const createVocabRow = (date: string, text: string, textUrl: string | null, from: string, to: string): string => {
    const meaningUrl = `https://translate.google.com/?sl=${from}&tl=${to}&text=${text}&op=translate`;
    
    return `
        <div class='row'>
            <div class='cell'>${new Date(+date).toLocaleDateString()}</div>
            <div class='cell'>${text}</div>
            ${textUrl ? `<div class='cell'><a target='_blank' rel='noopener noreferrer' href='${textUrl}'>here</a></div>` : '<div></div>'}
            <div class='cell'><a target='_blank' rel='noopener noreferrer' href='${meaningUrl}'>meaning</a></div>
            <div class='cell'><a target='_blank' rel='noopener noreferrer' id='delete${date}'>delete</a></div>
        </div>
    `;
};

const createVocabRowEventListener = (date: string): void => {
    const deleteButton = document.getElementById('delete' + date);
    if (deleteButton) {
        deleteButton.addEventListener('click', async () => {
            await deleteVocab(date);
            await refreshVocabTable();
        });
    }
};

export const refreshVocabTable = async (): Promise<void> => {
    const vocabs = await getVocabs();
    const vocabsElement = document.getElementById('vocabs');
    
    if (!vocabsElement) return;
    
    vocabsElement.innerHTML = '';
    
    if (vocabs && Object.keys(vocabs).length > 0) {
        const rowsHtml = Object.keys(vocabs)
            .map(key => createVocabRow(key, vocabs[key].vocab, vocabs[key].url, vocabs[key].from, vocabs[key].to))
            .join('');
        
        vocabsElement.innerHTML = rowsHtml;
        
        Object.keys(vocabs).forEach(key => createVocabRowEventListener(key));
    }
};