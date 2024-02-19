import "~/lib/style.css"

import { Toaster } from "react-hot-toast"
import { MemoryRouter } from "react-router-dom"

import { Routing } from "~/options/routes"

import Siderbar from "./Siderbar"

function Options() {
  return (
    <div className="max-w-screen-lg mx-auto text-base py-10 px-4">
      <Toaster
        toastOptions={{
          className: "!bg-secondary !text-secondary-foreground",
        }}
      />
      <MemoryRouter>
        <div className="flex sm:gap-20 h-full sm:flex-row flex-col">
          <Siderbar />
          <div className="flex-1">
            <Routing />
          </div>
        </div>
      </MemoryRouter>
    </div>
  )
}

export default Options
