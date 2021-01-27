// Package import
import * as i18n from 'i18n';
import path from 'path';

import { languageCodes } from '@shared/constants';

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