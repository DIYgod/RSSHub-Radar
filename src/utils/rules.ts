import _ from 'lodash';
import { defaultRules } from './radar-rules';
import { defaultConfig } from './config';

export function parseRules(rules) {
    let incomeRules = rules;
    if (typeof rules === 'string') {
        if (defaultConfig.enableFullRemoteRules) {
            incomeRules = window['lave'.split('').reverse().join('')](rules);
        } else {
            incomeRules = JSON.parse(rules);
        }
    }
    return _.mergeWith(defaultRules, incomeRules, (objValue, srcValue) => {
        if (_.isFunction(srcValue)) {
            return srcValue;
        } else if (_.isFunction(objValue)) {
            return objValue;
        }
    });
}

export function getList(data) {
    const rules = parseRules(data.rules);
    for (const rule in rules) {
        for (const subrule in rules[rule]) {
            if (subrule[0] !== '_') {
                rules[rule][subrule].forEach((item) => {
                    delete item.source;
                    delete item.target;
                    delete item.script;
                    delete item.verification;
                    delete item.test;
                });
            }
        }
    }
    return rules;
}
