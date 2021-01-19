// Package import
import { languageCodes } from '@shared/constants';
import * as i18n from 'i18n';
import path from 'path';

i18n.configure({
  locales: Object.values(languageCodes),
  defaultLocale: languageCodes.english,
  queryParameter: 'lang',
  directory: path.join('./', 'locales'),
  api: {
    '__': 'translate',
    '__n': 'translateN'
  },
});
export default i18n;