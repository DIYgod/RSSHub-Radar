import { Input } from "~/lib/components/Input"
import { Label } from "~/lib/components/Label"
import { Button } from "~/lib/components/Button"
import { defaultConfig, setConfig } from "~/lib/config"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/lib/components/Card"
import { Switch } from "~/lib/components/Switch"
import { quickSubscriptions } from "~/lib/quick-subscriptions"
import { useStorage } from "@plasmohq/storage/hook"
import _ from 'lodash';
import { useEffect, useState } from "react"
import { parseRules, getRulesCount } from "~/lib/rules"
import type { Rules as IRules } from "~/lib/types"
import { sendToBackground } from "@plasmohq/messaging"
import { Loader2 } from "lucide-react"
import toast from "react-hot-toast"

function General() {
  let [config] = useStorage("config")
  config = _.merge({}, defaultConfig, config)
  const [rules, setRules] = useState<IRules>({})
  useEffect(() => {
    sendToBackground({
      name: "requestDisplayedRules"
    }).then((res) => setRules(parseRules(res, true)))
  }, [])

  const [count, setCount] = useState(0)
  useEffect(() => {
    setCount(getRulesCount(rules))
  }, [rules])

  const [rulesUpdating, setRulesUpdating] = useState(false)

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
              <Switch id="notificationsAndReminders" checked={config.notice.badge} onCheckedChange={(value) => setConfig({
                notice: {
                  badge: value
                }
              })} />
            </div>
            <div className="grid w-full items-center gap-2">
              <Label>{chrome.i18n.getMessage("popupWindowHotKey")}</Label>
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
              <Input id="customRSSHubDomain" value={config.rsshubDomain} onChange={(e) => setConfig({
                rsshubDomain: e.target.value
              })} />
            </div>
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="accessKey" className="flex items-center">
                <span>{chrome.i18n.getMessage("accessKey")}</span>
                <a className="h-[14px] ml-1" target="_blank" href="https://docs.rsshub.app/install/config#access-keycode">
                  <i className="i-mingcute-question-line"></i>
                </a>
              </Label>
              <Input
                type="password"
                id="accessKey"
                value={config.rsshubAccessControl.accessKey} onChange={(e) => setConfig({
                  rsshubAccessControl: {
                    accessKey: e.target.value,
                  }
                })}
                placeholder={chrome.i18n.getMessage("configurationRequiredIfAccessKeysEnabled")}
              />
            </div>
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="remoteRulesUrl">{chrome.i18n.getMessage("remoteRulesUrl")}</Label>
              <Input id="remoteRulesUrl" value={config.remoteRulesUrl} onChange={(e) => setConfig({
                remoteRulesUrl: e.target.value
              })} />
            </div>
            <div className="grid w-full items-center gap-2">
              <Label>{chrome.i18n.getMessage("manuallyUpdate")}</Label>
              <p className="text-zinc-500 text-sm">{chrome.i18n.getMessage("totalNumberOfRules")}: {count}</p>
              <p className="text-zinc-500 text-sm">{chrome.i18n.getMessage("updateTip")}</p>
              <Button
                variant="secondary"
                disabled={rulesUpdating}
                onClick={() => {
                  setRulesUpdating(true)
                  sendToBackground({
                    name: "refreshRules"
                  }).then((res) => {
                    setRulesUpdating(false)
                    toast.success(chrome.i18n.getMessage("updateSuccessful"))
                  })
                }}
              >
                {rulesUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {chrome.i18n.getMessage("updateNow")}
              </Button>
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
                <Switch id={quickSubscription.key} checked={config.submitto[quickSubscription.key]} onCheckedChange={(value) => setConfig({
                  submitto: {
                    [quickSubscription.key]: value
                  }
                } as any)} />
                <Label className="w-28" htmlFor={quickSubscription.key}>{chrome.i18n.getMessage(quickSubscription.name) || quickSubscription.name}</Label>
                {config.submitto[quickSubscription.key] && (
                  "subscribeDomainKey" in quickSubscription ? (
                    <Input
                      className="flex-1"
                      id={quickSubscription.subscribeDomainKey}
                      value={config.submitto[quickSubscription.subscribeDomainKey]}
                      onChange={(e) => setConfig({
                        submitto: {
                          [quickSubscription.subscribeDomainKey]: e.target.value
                        }
                      } as any)}
                      placeholder={chrome.i18n.getMessage("fillInstanceDomain")}
                    />
                  ) : (
                    <Input className="flex-1" disabled value={quickSubscription.subscribeDomain}/>
                  )
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