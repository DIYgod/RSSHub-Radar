import FollowLogo from "data-base64:~/assets/follow.svg"
import InoreaderLogo from "data-base64:~/assets/inoreader.svg"
import MinifluxLogo from "data-base64:~/assets/miniflux.ico"
import FreshRSSLogo from "data-base64:~/assets/freshrss.svg"
import TinyTinyRSSLogo from "data-base64:~/assets/ttrss.png"
import FeedlyLogo from "data-base64:~/assets/feedly.png"

export const logoMap = new Map<string, string>([
  ["follow", FollowLogo],
  ["inoreader", InoreaderLogo],
  ["miniflux", MinifluxLogo],
  ["freshrss", FreshRSSLogo],
  ["ttrss", TinyTinyRSSLogo],
  ["feedly", FeedlyLogo],
])
