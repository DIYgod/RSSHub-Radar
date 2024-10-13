import _ from "lodash"

import MD5 from "md5.js"
import { getConfig } from "./config"
import { defaultRules } from "./radar-rules"
import type { Rules } from "./types"
import { getRadarRulesUrl } from "./utils"

export function parseRules(rules: string, forceJSON?: boolean) {
  let incomeRules = rules
  if (incomeRules) {
    if (typeof rules === "string") {
      try {
        incomeRules = JSON.parse(rules)
      } catch (error) {}
    }
  }
  return _.mergeWith(defaultRules, incomeRules, (objValue, srcValue) => {
    if (_.isFunction(srcValue)) {
      return srcValue
    } else if (_.isFunction(objValue)) {
      return objValue
    }
  }) as Rules
}

export function getRulesCount(rules: Rules) {
  let index = 0
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
  return new Promise<string>(async (resolve, reject) => {
    const config = await getConfig()
    try {
      let url = getRadarRulesUrl(config.rsshubDomain)
      
      if (config.rsshubAccessControl.accessKey) {
        const path = new URL(url).pathname
        const code = new MD5().update(path + config.rsshubAccessControl.accessKey).digest("hex")
        url = `${url}?code=${code}`
      }

      const res = await fetch(url)
      resolve(res.text())
    } catch (error) {
      reject(error)
    }
  })
}