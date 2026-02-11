import { getDisplayedRules } from "~/background/rules"

const handler = async (
  _message?: unknown,
  _sender?: chrome.runtime.MessageSender,
) => getDisplayedRules()

export default handler
