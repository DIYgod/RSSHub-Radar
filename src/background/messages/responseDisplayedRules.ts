import { setDisplayedRules } from "~/background/rules"

const handler = (
  message: { body?: { displayedRules?: any } },
  _sender?: chrome.runtime.MessageSender,
) => {
  setDisplayedRules(message?.body?.displayedRules)
  return ""
}

export default handler
