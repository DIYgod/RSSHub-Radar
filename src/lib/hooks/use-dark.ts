import { useLocalStorage } from "foxact/use-local-storage"
import { useEffect, useMemo, useSyncExternalStore } from "react"

const query = "(prefers-color-scheme: dark)"

function getSnapshot() {
  return window.matchMedia(query).matches
}

function getServerSnapshot(): undefined {
  return undefined
}

function subscribe(callback: () => void) {
  const matcher = window.matchMedia(query)
  matcher.addEventListener("change", callback)
  return () => {
    matcher.removeEventListener("change", callback)
  }
}

function useSystemDark() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

const themeOptions = ["system", "light", "dark"] as const
export type Theme = (typeof themeOptions)[number]

function isDarkMode(setting?: Theme | null, isSystemDark?: boolean) {
  return setting === "dark" || (isSystemDark && setting !== "light")
}

export function useDark(themeKey = "use-dark") {
  const [theme, setTheme] = useLocalStorage<Theme>(themeKey, "system")
  const isSystemDark = useSystemDark()

  const isDark = useMemo(
    () => isDarkMode(theme, isSystemDark),
    [isSystemDark, theme],
  )

  const toggleDark = () => {
    if (theme === "system") {
      setTheme(isSystemDark ? "light" : "dark")
    } else {
      setTheme("system")
    }
  }

  useEffect(() => {
    const isDark = isDarkMode(theme, isSystemDark)
    if (isDark) {
      document.documentElement.classList.toggle("dark", true)
    } else {
      document.documentElement.classList.toggle("dark", false)
    }

    if (
      (theme === "dark" && isSystemDark) ||
      (theme === "light" && !isSystemDark)
    ) {
      setTheme("system")
    }
  }, [theme, isSystemDark, setTheme])

  return { isDark, toggleDark }
}
