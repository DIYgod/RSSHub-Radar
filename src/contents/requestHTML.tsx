import { useMessage } from "@plasmohq/messaging/hook"

const RequestHTML = () => {
  useMessage<string, string>(async (req, res) => {
    if (req.name === "requestHTML") {
      res.send(document.documentElement.outerHTML)
    }
  })

  return <></>
}

export default RequestHTML