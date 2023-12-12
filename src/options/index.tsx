import { MemoryRouter } from "react-router-dom"
import { Routing } from "~/options/routes"
import "~/lib/style.css"
import Siderbar from "./Siderbar"

function Options() {
  return (
    <div className="max-w-screen-lg mx-auto text-base py-10 h-screen">
      <MemoryRouter>
        <div className="flex space-x-10 h-full">
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
