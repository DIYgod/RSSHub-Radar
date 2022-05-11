import { I18n } from 'i18n-js';
import en from '../../translations/en.json';
import es from '../../translations/es.json';
import eu from '../../translations/eu.json';
import zh from '../../translations/zh.json';
const i18n = new I18n({
    en,
    es,
    eu,
    zh,
});
i18n.enableFallback = true;
i18n.defaultLocale = 'zh';
i18n.locale = navigator.language;

export default i18n;
