import { I18n } from 'i18n-js';
import en from '../../translations/en.json';
import es from '../../translations/es.json';
import eu from '../../translations/eu.json';
import pt from '../../translations/pt.json';
import zh from '../../translations/zh.json';
const i18n = new I18n({
    en,
    es,
    eu,
    pt,
    zh,
});
i18n.enableFallback = true;
i18n.defaultLocale = 'en';
i18n.locale = navigator.language;

export default i18n;
