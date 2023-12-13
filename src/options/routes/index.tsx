import { Route, Routes } from "react-router-dom"

import { About } from "./About"
import { Rules } from "./Rules"
import { General } from "./General"

export const Routing = () => (
  <Routes>
    <Route path="/" element={<General />} />
    <Route path="/rules" element={<Rules />} />
    <Route path="/about" element={<About />} />
  </Routes>
)