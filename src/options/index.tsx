import "~/lib/style.css"

import { Toaster } from "react-hot-toast"
import { MemoryRouter } from "react-router-dom"

import { Routing } from "~/options/routes"

import Siderbar from "./Siderbar"

function Options() {
  return (
    <div className="max-w-screen-lg mx-auto text-base py-10">
      <Toaster
        toastOptions={{
          className: "!bg-secondary !text-secondary-foreground",
        }}
      />
      <MemoryRouter>
        <div className="flex space-x-20 h-full">
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
