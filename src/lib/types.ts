export type Rule = {
  title: string
  docs: string
  source: string[]
  target: string | ((params: any, url: string) => string)
}

export type Rules = {
  [domain: string]: {
    _name: string
    [subdomain: string]: Rule[] | string
  }
}

export type RSSData = {
  url: string
  title: string
  image?: string
  path?: string
  isDocs?: boolean
}
