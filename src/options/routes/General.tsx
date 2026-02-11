import _ from "lodash"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

import { Button } from "~/lib/components/Button"
import { Card, CardContent, CardHeader, CardTitle } from "~/lib/components/Card"
import { Input } from "~/lib/components/Input"
import { Label } from "~/lib/components/Label"
import { Switch } from "~/lib/components/Switch"
import { defaultConfig, getConfig, setConfig } from "~/lib/config"
import { sendToBackground } from "~/lib/messaging"
import { quickSubscriptions } from "~/lib/quick-subscriptions"
import { logoMap } from "~/lib/quick-subscriptions-logos"
import report from "~/lib/report"
import { getRulesCount, parseRules } from "~/lib/rules"
import type { Rules as IRules } from "~/lib/types"
import { getRadarRulesUrl } from "~/lib/utils"

function General() {
  const [config, setConfigState] = useState(defaultConfig)

  const updateConfig = (partialConfig: Partial<typeof defaultConfig>) => {
    setConfigState(
      (currentConfig) =>
        _.merge({}, currentConfig, partialConfig) as typeof defaultConfig,
    )
    void setConfig(partialConfig)
  }

  const [rules, setRules] = useState<IRules>({})
  useEffect(() => {
    getConfig().then(setConfigState)

    sendToBackground({
      name: "requestDisplayedRules",
    }).then((res) => setRules(parseRules(res, true)))

    const onStorageChange = (
      changes: {
        [key: string]: chrome.storage.StorageChange
      },
      areaName: string,
    ) => {
      if (areaName !== "local" || !changes.config) {
        return
      }

      setConfigState(
        _.merge(
          {},
          defaultConfig,
          changes.config.newValue,
        ) as typeof defaultConfig,
      )
    }

    chrome.storage.onChanged.addListener(onStorageChange)

    report({
      name: "options-general",
    })

    return () => {
      chrome.storage.onChanged.removeListener(onStorageChange)
    }
  }, [])

  const [count, setCount] = useState(0)
  useEffect(() => {
    setCount(getRulesCount(rules))
  }, [rules])

  const [rulesUpdating, setRulesUpdating] = useState(false)

  const [isNotificationPermissionGranted, setIsNotificationPermissionGranted] =
    useState(false)

  useEffect(() => {
    chrome.permissions.contains(
      {
        permissions: ["notifications"],
      },
      (granted) => {
        setIsNotificationPermissionGranted(granted)
      },
    )
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-medium leading-10 mb-6 text-primary border-b pb-4">
        {chrome.i18n.getMessage("general")}
      </h1>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>{chrome.i18n.getMessage("settings")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="updateNotification">
                {chrome.i18n.getMessage("updateNotification")}
              </Label>
              <Switch
                id="updateNotification"
                checked={isNotificationPermissionGranted}
                onCheckedChange={(value) => {
                  if (!value) {
                    chrome.permissions.remove(
                      {
                        permissions: ["notifications"],
                      },
                      (removed) => {
                        setIsNotificationPermissionGranted(!removed)
                      },
                    )
                    return
                  }
                  chrome.permissions.request(
                    {
                      permissions: ["notifications"],
                    },
                    (granted) => {
                      setIsNotificationPermissionGranted(granted)
                    },
                  )
                }}
              />
            </div>
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="notificationsAndReminders">
                {chrome.i18n.getMessage("notificationsAndReminders")}
              </Label>
              <Switch
                id="notificationsAndReminders"
                checked={config.notice.badge}
                onCheckedChange={(value) =>
                  updateConfig({
                    notice: {
                      badge: value,
                    },
                  })
                }
              />
            </div>
            <div className="grid w-full items-center gap-2">
              <Label>{chrome.i18n.getMessage("popupWindowHotKey")}</Label>
              <Button
                variant="secondary"
                onClick={() => {
                  chrome.tabs.create({
                    url: "chrome://extensions/shortcuts",
                  })
                }}
              >
                {chrome.i18n.getMessage("clickToSet")}
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              {chrome.i18n.getMessage("RSSHubRelatedSettings")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="customRSSHubDomain">
                {chrome.i18n.getMessage("customRSSHubDomain")}
              </Label>
              <Input
                id="customRSSHubDomain"
                value={config.rsshubDomain}
                onChange={(e) =>
                  updateConfig({
                    rsshubDomain: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="accessKey" className="flex items-center">
                <span>{chrome.i18n.getMessage("accessKey")}</span>
                <a
                  className="h-[14px] ml-1"
                  target="_blank"
                  href="https://docs.rsshub.app/deploy/config#access-control-configurations"
                >
                  <i className="i-mingcute-question-line"></i>
                </a>
              </Label>
              <Input
                type="password"
                id="accessKey"
                value={config.rsshubAccessControl.accessKey}
                onChange={(e) =>
                  updateConfig({
                    rsshubAccessControl: {
                      accessKey: e.target.value,
                    },
                  } as any)
                }
                placeholder={chrome.i18n.getMessage(
                  "configurationRequiredIfAccessKeysEnabled",
                )}
              />
              {config.rsshubAccessControl.accessKey && (
                <div className="flex items-center space-x-2">
                  <Label>{chrome.i18n.getMessage("accessKeyType")}</Label>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="accessKeyTypeCode"
                        checked={
                          config.rsshubAccessControl.accessKeyType === "code"
                        }
                        onChange={() =>
                          updateConfig({
                            rsshubAccessControl: {
                              accessKeyType: "code",
                            },
                          } as any)
                        }
                      />
                      <label htmlFor="accessKeyTypeCode">code={"{md5}"}</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="accessKeyTypeKey"
                        checked={
                          config.rsshubAccessControl.accessKeyType === "key"
                        }
                        onChange={() =>
                          updateConfig({
                            rsshubAccessControl: {
                              accessKeyType: "key",
                            },
                          } as any)
                        }
                      />
                      <label htmlFor="accessKeyTypeKey">
                        key={"{accessKey}"}
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="remoteRulesUrl">
                {chrome.i18n.getMessage("remoteRulesUrl")}
              </Label>
              <Input
                id="remoteRulesUrl"
                disabled
                value={getRadarRulesUrl(config.rsshubDomain)}
              />
            </div>
            <div className="grid w-full items-center gap-2">
              <Label>{chrome.i18n.getMessage("manuallyUpdate")}</Label>
              <p className="text-zinc-500 text-sm">
                {chrome.i18n.getMessage("totalNumberOfRules")}: {count}
              </p>
              <p className="text-zinc-500 text-sm">
                {chrome.i18n.getMessage("updateTip")}
              </p>
              <Button
                variant="secondary"
                disabled={rulesUpdating}
                onClick={() => {
                  setRulesUpdating(true)
                  sendToBackground({
                    name: "refreshRules",
                  }).then((res) => {
                    setRulesUpdating(false)
                    toast.success(chrome.i18n.getMessage("updateSuccessful"))
                  })
                }}
              >
                {rulesUpdating && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
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
              <div
                className="flex sm:items-center gap-2 sm:flex-row flex-col"
                key={quickSubscription.key}
              >
                <div className="flex items-center gap-2 h-10">
                  <Switch
                    id={quickSubscription.key}
                    checked={config.submitto[quickSubscription.key]}
                    onCheckedChange={(value) =>
                      updateConfig({
                        submitto: {
                          [quickSubscription.key]: value,
                        },
                      } as any)
                    }
                  />
                  <Label
                    className="w-28 flex gap-2 items-center"
                    htmlFor={quickSubscription.key}
                  >
                    {logoMap.get(quickSubscription.key) && (
                      <img
                        src={logoMap.get(quickSubscription.key)}
                        className="w-5 h-5 rounded"
                      />
                    )}
                    <span className="shrink-0">
                      {chrome.i18n.getMessage(quickSubscription.name) ||
                        quickSubscription.name}
                    </span>
                  </Label>
                </div>
                {config.submitto[quickSubscription.key] &&
                  ("subscribeDomainKey" in quickSubscription ? (
                    <Input
                      className="flex-1"
                      id={quickSubscription.subscribeDomainKey}
                      value={
                        config.submitto[quickSubscription.subscribeDomainKey]
                      }
                      onChange={(e) =>
                        updateConfig({
                          submitto: {
                            [quickSubscription.subscribeDomainKey]:
                              e.target.value,
                          },
                        } as any)
                      }
                      placeholder={chrome.i18n.getMessage("fillInstanceDomain")}
                    />
                  ) : (
                    <Input
                      className="flex-1"
                      disabled
                      value={quickSubscription.subscribeDomain}
                    />
                  ))}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export { General }
