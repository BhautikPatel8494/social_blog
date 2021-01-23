// External level import
import i18n from '../../config/i18n.config';
import { languageCodes } from '../constants';
import { ObjectLiteral } from '../interface/common.interface';
import { Response } from 'express';

let i18nProvider: ObjectLiteral = null;
class LocaleService {

  constructor(i18nProviderFromReq: ObjectLiteral) {
    i18nProvider = i18nProviderFromReq;
  }

  translateText(path: string, statusCode: number, res: Response, data: ObjectLiteral = null) {
    const translatedMessage = i18nProvider.__({ phrase: path, locale: languageCodes.english });
    return res.json({ statusCode, message: translatedMessage, data })
  }
}

const locale = new LocaleService(i18n);
export const response = locale.translateText;