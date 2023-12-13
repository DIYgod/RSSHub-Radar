import {
  Card,
  CardContent,
} from "~/lib/components/Card"

function About() {
  return (
    <div>
      <h1 className="text-3xl font-medium leading-10 mb-6 text-orange-500 border-b pb-4">{chrome.i18n.getMessage("about")}</h1>
      <div className="space-y-4">
        <Card>
          <CardContent className="space-y-4 content text-zinc-700 py-10">
            <p dangerouslySetInnerHTML={{
              __html: chrome.i18n.getMessage("RSSHubRadarInfo")
            }}></p>
            <p dangerouslySetInnerHTML={{
              __html: chrome.i18n.getMessage("sponsoredDevelopment")
            }}></p>
            <p>{chrome.i18n.getMessage("updateLog")}: <a target="_blank" href="https://github.com/DIYgod/RSSHub-Radar/releases">https://github.com/DIYgod/RSSHub-Radar/releases</a></p>
            <p>{chrome.i18n.getMessage('questionFeedback')}: <a target="_blank" href="https://github.com/DIYgod/RSSHub-radar/issues">https://github.com/DIYgod/RSSHub-radar/issues</a></p>
            <p>🐱 GitHub: <a target="_blank" href="https://github.com/DIYgod/RSSHub-Radar">https://github.com/DIYgod/RSSHub-Radar</a></p>
            <p dangerouslySetInnerHTML={{
              __html: chrome.i18n.getMessage("rsshubDocument")
            }}></p>
            <p>&nbsp;</p>
            <p>Made with <span className="text-red-500">♥</span> by <a className="underline text-orange-500" href="https://diygod.cc/">DIYgod</a></p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export { About }