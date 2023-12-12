import { Route, Routes } from "react-router-dom"

import { About } from "./About"
import { General } from "./General"

export const Routing = () => (
  <Routes>
    <Route path="/" element={<General />} />
    <Route path="/about" element={<About />} />
  </Routes>
)