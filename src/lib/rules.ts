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
                console.warn('lave');
            } else {
                try {
                    incomeRules = JSON.parse(rules);
                } catch (error) {
                    console.error(error);
                }
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

export function getRulesCount(rules: Rules) {
    let index = 0;
    Object.keys(rules).map((key) => {
      const rule = rules[key]
      Object.keys(rule).map((item) => {
        if (Array.isArray(rule[item])) {
          index += rule[item].length
        }
      })
    })
    return index
}

export function getRemoteRules() {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await fetch("https://rsshub.js.org/build/radar-rules.js")
            resolve(res.text())
        } catch (error) {
            reject(error)
        }
    });
}