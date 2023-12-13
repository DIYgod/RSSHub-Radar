import _ from 'lodash';
import { defaultRules } from './radar-rules';
import { defaultConfig } from './config';
import type { Rules } from './types';

export function parseRules(rules: string, forceJSON?: boolean) {
    let incomeRules = rules;
    if (incomeRules) {
        if (typeof rules === 'string') {
            if (defaultConfig.enableFullRemoteRules && !forceJSON) {
                incomeRules = window['lave'.split('').reverse().join('')](rules);
            } else {
                incomeRules = JSON.parse(rules);
            }
        }
    }
    return _.mergeWith(defaultRules, incomeRules, (objValue, srcValue) => {
        if (_.isFunction(srcValue)) {
            return srcValue;
        } else if (_.isFunction(objValue)) {
            return objValue;
        }
    }) as Rules;
}
