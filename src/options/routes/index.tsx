import { Route, Routes } from "react-router"

import { About } from "./About"
import { General } from "./General"
import { Rules } from "./Rules"

export const Routing = () => (
  <Routes>
    <Route path="/" element={<General />} />
    <Route path="/rules" element={<Rules />} />
    <Route path="/about" element={<About />} />
  </Routes>
)
