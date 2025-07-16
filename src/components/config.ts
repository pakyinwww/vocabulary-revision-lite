import { getConfig, saveConfig, getTranslateFromTo } from '../lib/common';

export const refreshConfig = async (): Promise<void> => {
    const config = await getConfig();
    const { from, to } = getTranslateFromTo();
    from.value = config.from;
    to.value = config.to;
};

export const addConfigListeners = (): void => {
    const { from, to } = getTranslateFromTo();

    from.addEventListener('change', () => {
        saveConfig('from', from.value);
    });
    
    to.addEventListener('change', () => {
        saveConfig('to', to.value);
    });
};