import { refreshRules } from "~/background/rules"

const handler = async (
  _message?: unknown,
  _sender?: chrome.runtime.MessageSender,
) => {
  await refreshRules()
  return true
}

export default handler
