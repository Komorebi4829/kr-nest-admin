import { isNil } from 'lodash';

import { useCallback, useMemo } from 'react';

import { useStore } from 'zustand';

import { config } from '@/config';
import { deepMerge } from '@/utils';

import { defaultLang } from './_default.config';
import { langs } from './langs';
import { LocaleStore } from './store';

export const getDefaultLang = () => {
    const fallback = deepMerge(defaultLang, config().locale ?? {});
    const lang = langs.find(({ name }) => fallback.name === name);
    return !isNil(lang) ? lang : langs[0];
};

export const useLocale = () => {
    const current = useStore(LocaleStore, (state) => state.name);
    const lang = langs.find(({ name }) => current === name);
    return useMemo(() => (!isNil(lang) ? lang : getDefaultLang()), [current]);
};
export const useLocalChange = () =>
    useCallback(
        useStore(LocaleStore, (state) => state.changeLang),
        [],
    );
