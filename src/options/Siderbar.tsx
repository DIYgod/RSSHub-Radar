import RSSHubIcon from "data-base64:~/assets/icon.png"
import { Link, useLocation } from "react-router"
import { useMediaQuery } from "usehooks-ts"

import { AppearanceSwitch } from "~/lib/components/AppearanceSwitch"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "~/lib/components/Sheet"
import { cn } from "~/lib/utils"

import info from "../../package.json"

function SiderbarContent({
  withClose,
}: {
  withClose?: boolean
}) {
  const location = useLocation()
  const links = [
    {
      path: "/",
      icon: "i-mingcute-settings-3-line",
      text: "general",
    },
    {
      path: "/rules",
      icon: "i-mingcute-list-check-2-line",
      text: "rules",
    },
    {
      path: "/about",
      icon: "i-mingcute-emoji-2-line",
      text: "about",
    },
  ]

  const Close = withClose ? SheetClose : (props) => <>{props.children}</>

  return (
    <>
      <div>
        <div className="px-4 flex items-center space-x-2 text-primary text-xl font-bold mb-8">
          <img className="w-10 h-10" src={RSSHubIcon} />
          <span>RSSHub Radar</span>
        </div>
      </div>
      <ul className="w-56 text-lg space-y-2 flex-1">
        {links.map((link) => (
          <li key={link.path}>
            <Close asChild>
              <Link
                to={link.path}
                className={cn(
                  location.pathname === link.path
                    ? "bg-primary/10 text-primary"
                    : "",
                  "px-4 py-3 hover:bg-primary/10 transition-colors rounded-lg flex items-center space-x-2",
                )}
              >
                <i className={link.icon + " w-5 h-5"}></i>
                <span>{chrome.i18n.getMessage(link.text)}</span>
              </Link>
            </Close>
          </li>
        ))}
      </ul>
      <footer className="text-zinc-500 text-center text-sm">
        <AppearanceSwitch className="mx-auto mb-2 text-2xl" />
        <p>Version v{info.version}</p>
        <p>
          Made with <span className="text-red-500">♥</span> by{" "}
          <a className="underline text-primary" href="https://diygod.cc/">
            DIYgod
          </a>
        </p>
      </footer>
    </>
  )
}

function Siderbar() {
  const matches = useMediaQuery("(min-width: 640px)")

  return (
    <div className="relative">
      {matches ? (
        <div className="flex flex-col h-[calc(100vh-80px)] sticky top-10">
          <SiderbarContent />
        </div>
      ) : (
        <div className="flex absolute right-2 top-2">
          <Sheet>
            <SheetTrigger className="text-2xl">
              <i className="i-mingcute-menu-line" />
            </SheetTrigger>
            <SheetContent side={"left"} className="w-60 px-0">
              <div className="flex flex-col h-[calc(100vh-48px)] items-center">
                <SiderbarContent withClose />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      )}
    </div>
  )
}

export default Siderbar
