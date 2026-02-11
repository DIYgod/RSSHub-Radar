import FeedlyLogo from "~/assets/feedly.png"
import FollowLogo from "~/assets/follow.svg"
import FreshRSSLogo from "~/assets/freshrss.svg"
import InoreaderLogo from "~/assets/inoreader.svg"
import MinifluxLogo from "~/assets/miniflux.ico"
import NewsBlurLogo from "~/assets/newsblur.png"
import TinyTinyRSSLogo from "~/assets/ttrss.png"

export const logoMap = new Map<string, string>([
  ["follow", FollowLogo],
  ["inoreader", InoreaderLogo],
  ["miniflux", MinifluxLogo],
  ["freshrss", FreshRSSLogo],
  ["ttrss", TinyTinyRSSLogo],
  ["feedly", FeedlyLogo],
  ["newsblur", NewsBlurLogo],
])
