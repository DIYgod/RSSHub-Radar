import { useState } from "react"
import { Input } from "~/lib/components/Input"
import { Label } from "~/lib/components/Label"
import { Button } from "~/lib/components/Button"
import { defaultConfig, getConfig, setConfig } from "~/lib/config"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/lib/components/Card"
import { Switch } from "~/lib/components/Switch"
import { quickSubscriptions } from "~/lib/quick-subscriptions"

function General() {
  const [config, setConfig] = useState(defaultConfig)
  getConfig().then(setConfig)

  return (
    <div>
      <h1 className="text-3xl font-medium leading-10 mb-6 text-orange-500 border-b pb-4">{chrome.i18n.getMessage("general")}</h1>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>{chrome.i18n.getMessage("settings")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="notificationsAndReminders">{chrome.i18n.getMessage("notificationsAndReminders")}</Label>
              <Switch id="notificationsAndReminders" />
            </div>
            <div className="grid w-full items-center gap-2">
              <Label>{chrome.i18n.getMessage("hotKey")}</Label>
              <Button variant="secondary" onClick={() => {
                chrome.tabs.create({
                  url: 'chrome://extensions/shortcuts'
                });
              }}>{chrome.i18n.getMessage("clickToSet")}</Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{chrome.i18n.getMessage("RSSHubRelatedSettings")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="customRSSHubDomain">{chrome.i18n.getMessage("customRSSHubDomain")}</Label>
              <Input id="customRSSHubDomain" value={config.rsshubDomain}/>
            </div>
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="accessKey" className="flex items-center">
                <span>{chrome.i18n.getMessage("accessKey")}</span>
                <a className="h-[14px] ml-1" target="_blank" href="https://docs.rsshub.app/install/config#access-keycode">
                  <i className="icon-[mingcute--question-line]"></i>
                </a>
              </Label>
              <Input type="password" id="accessKey" value={config.rsshubAccessControl.accessKey}/>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{chrome.i18n.getMessage("quickSubscription")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {quickSubscriptions.map((quickSubscription) => (
              <div className="flex items-center space-x-2 h-10">
                <Switch id={quickSubscription.key} />
                <Label className="w-28" htmlFor={quickSubscription.key}>{quickSubscription.name}</Label>
                {quickSubscription.domainKey ? (
                  <Input className="flex-1" id={quickSubscription.domainKey} value={config.submitto[quickSubscription.domainKey]}/>
                ) : (
                  <Input className="flex-1" disabled id={quickSubscription.domainKey} value={config.submitto[quickSubscription.domainKey]}/>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export { General }