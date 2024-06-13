import RouteRecognizer from "route-recognizer"
import { parse } from "tldts"

import { parseRules } from "./rules"
import type { RSSData, Rule } from "./types"

function ruleHandler(rule: Rule, params, url, html, success, fail) {
  const run = () => {
    let resultWithParams
    if (typeof rule.target === "function") {
      try {
        resultWithParams = rule.target(params, url)
      } catch (error) {
        resultWithParams = ""
      }
    } else if (typeof rule.target === "string") {
      resultWithParams = rule.target
    }

    // clean params with regex requirements
    // /npm/package/:name{(@[a-z0-9-~][a-z0-9-._~]*/)?[a-z0-9-~][a-z0-9-._~]*} -> /npm/package/:name
    resultWithParams = resultWithParams.replace(
      /\/:\w+\{[^}]*\}(?=\/|$)/g,
      (match) => match.replace(/\{[^}]*\}/, ""),
    )

    if (resultWithParams) {
      // if no :param in resultWithParams, requiredParams will be null
      // in that case, just skip the following steps and return resultWithParams
      const requiredParams = resultWithParams
        .match(/\/:\w+\??(?=\/|$)/g)
        ?.map((param) => ({
          name: param.slice(2).replace(/\?$/, ""),
          optional: param.endsWith("?"),
        }))
      if (!requiredParams) {
        return resultWithParams
      }
      for (const param of requiredParams) {
        if (params[param.name]) {
          // successfully matched
          const regex = new RegExp(`/:${param.name}\\??(?=/|$)`)
          resultWithParams = resultWithParams.replace(
            regex,
            `/${params[param.name]}`,
          )
        } else if (param.optional) {
          // missing optional parameter, drop all following parameters, otherwise the route will be invalid
          const regex = new RegExp(`/:${param.name}\\?(/.*)?$`)
          resultWithParams = resultWithParams.replace(regex, "")
          break
        } else {
          // missing necessary parameter, fail
          resultWithParams = ""
          break
        }
      }
      // bypassing double-check since `:` maybe a part of parameter value
      // if (resultWithParams && resultWithParams.includes(':')) {
      //     // double-check
      //     resultWithParams = '';
      // }
    }
    return resultWithParams
  }
  const resultWithParams = run()
  if (resultWithParams) {
    success(resultWithParams)
  } else {
    fail()
  }
}

function formatBlank(str1, str2) {
  if (str1 && str2) {
    return (
      str1 +
      (str1[str1.length - 1].match(/[a-zA-Z0-9]/) ||
      str2[0].match(/[a-zA-Z0-9]/)
        ? " "
        : "") +
      str2
    )
  } else {
    return (str1 || "") + (str2 || "")
  }
}

export function getPageRSSHub(data: {
  url: string
  html: string
  rules: string
}) {
  const { url, html } = data
  const rules = parseRules(data.rules)

  let parsedDomain
  try {
    parsedDomain = parse(new URL(url).hostname)
  } catch (error) {
    return []
  }
  if (parsedDomain && parsedDomain.domain) {
    const subdomain = parsedDomain.subdomain
    const domain = parsedDomain.domain
    if (rules[domain]) {
      let rule = rules[domain][subdomain || "."] as Rule[]
      if (!rule) {
        if (subdomain === "www") {
          rule = rules[domain]["."] as Rule[]
        } else if (!subdomain) {
          rule = rules[domain].www as Rule[]
        }
      }
      if (rule) {
        const recognized = []
        rule.forEach((ru, index) => {
          const oriSources =
            Object.prototype.toString.call(ru.source) === "[object Array]"
              ? ru.source
              : typeof ru.source === "string"
                ? [ru.source]
                : []
          let sources = []
          // route-recognizer do not support optional segments or partial matching
          // thus, we need to manually handle it
          // allowing partial matching is necessary, since many rule authors did not mark optional segments
          oriSources.forEach((source) => {
            // trimming `?` is necessary, since route-recognizer considers it as a part of segment
            source = source.replace(/(\/:\w+)\?(?=\/|$)/g, "$1")
            sources.push(source)
            let tailMatch
            do {
              tailMatch = source.match(/\/:\w+$/)
              if (tailMatch) {
                const tail = tailMatch[0]
                source = source.slice(0, source.length - tail.length)
                sources.push(source)
              }
            } while (tailMatch)
          })
          // deduplicate (some rule authors may already have done similar job)
          sources = sources.filter(
            (item, index) => sources.indexOf(item) === index,
          )
          // match!
          sources.forEach((source) => {
            const router = new RouteRecognizer()
            router.add([
              {
                path: source,
                handler: index,
              },
            ])
            const result = router.recognize(
              new URL(url).pathname.replace(/\/$/, ""),
            )
            if (result && result[0]) {
              recognized.push(result[0])
            }
          })
        })
        const result: RSSData[] = []
        Promise.all(
          recognized.map(
            (recog) =>
              new Promise<void>((resolve) => {
                ruleHandler(
                  rule[recog.handler],
                  recog.params,
                  url,
                  html,
                  (parsed) => {
                    if (parsed) {
                      result.push({
                        title: formatBlank(
                          rules[domain]._name ? "Current" : "",
                          rule[recog.handler].title,
                        ),
                        url: "{rsshubDomain}" + parsed,
                        path: parsed,
                      })
                    } else {
                      result.push({
                        title: formatBlank(
                          rules[domain]._name ? "Current" : "",
                          rule[recog.handler].title,
                        ),
                        url: rule[recog.handler].docs,
                        isDocs: true,
                      })
                    }
                    resolve()
                  },
                  () => {
                    resolve()
                  },
                )
              }),
          ),
        )
        return result
      } else {
        return []
      }
    } else {
      return []
    }
  } else {
    return []
  }
}

export function getWebsiteRSSHub(data: { url: string; rules: string }) {
  const { url } = data
  const rules = parseRules(data.rules)
  let parsedDomain
  try {
    parsedDomain = parse(new URL(url).hostname)
  } catch (error) {
    return []
  }
  if (parsedDomain && parsedDomain.domain) {
    const domain = parsedDomain.domain
    if (rules[domain]) {
      const domainRules = []
      for (const subdomainRules in rules[domain]) {
        if (subdomainRules[0] !== "_") {
          domainRules.push(...rules[domain][subdomainRules])
        }
      }
      return domainRules.map(
        (rule) =>
          ({
            title: formatBlank(rules[domain]._name, rule.title),
            url: rule.docs,
            isDocs: true,
          }) as RSSData,
      )
    } else {
      return []
    }
  } else {
    return []
  }
}
