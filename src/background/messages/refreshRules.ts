import { refreshRules } from "~/background/rules"

const handler = async (
  _message?: unknown,
  _sender?: chrome.runtime.MessageSender,
) => {
  try {
    await refreshRules()
    return {
      success: true,
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error while refreshing rules",
    }
  }
}

export default handler
