import { useDark } from "~/lib/hooks/use-dark"

export function AppearanceSwitch({ className = "" }: { className?: string }) {
  const { toggleDark } = useDark()

  return (
    <button type="button" onClick={toggleDark} className={"flex " + className}>
      <div className="i-mingcute-sun-2-line scale-100 dark:scale-0 transition-transform duration-500 rotate-0 dark:-rotate-90" />
      <div className="i-mingcute-moon-line absolute scale-0 dark:scale-100 transition-transform duration-500 rotate-90 dark:rotate-0" />
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
