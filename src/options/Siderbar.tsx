import { Link } from "react-router-dom";
import RSSHubIcon from "data-base64:~/assets/icon.png"
import info from "../../package.json"
import { useLocation } from 'react-router-dom';
import { cn } from "~/lib/utils";

function Siderbar() {
  const location = useLocation();
  const links = [{
    path: "/",
    icon: "i-mingcute-settings-3-line",
    text: "general",
  }, {
    path: "/rules",
    icon: "i-mingcute-list-check-2-line",
    text: "rules",
  }, {
    path: "/about",
    icon: "i-mingcute-emoji-2-line",
    text: "about",
  }]

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] sticky top-10">
      <div>
        <div className="px-4 flex items-center space-x-2 text-orange-500 text-xl font-bold mb-8">
          <img className="w-10 h-10" src={RSSHubIcon} /><span>RSSHub Radar</span>
        </div>
      </div>
      <ul className="w-56 text-lg space-y-2 flex-1">
        {links.map((link) => (
          <li key={link.path}>
            <Link to={link.path} className={cn(location.pathname === link.path ? "bg-orange-50 text-orange-500" : "", "px-4 py-3 hover:bg-orange-50 transition-colors rounded-lg flex items-center space-x-2")}>
              <i className={link.icon + " w-5 h-5"}></i>
              <span>{chrome.i18n.getMessage(link.text)}</span>
            </Link>
          </li>
        ))}
      </ul>
      <footer className="text-zinc-500 text-center text-sm">
        <p>Version v{info.version}</p>
        <p>Made with <span className="text-red-500">♥</span> by <a className="underline text-orange-500" href="https://diygod.cc/">DIYgod</a></p>
      </footer>
    </div>
  )
}

export default Siderbar
