import { Box } from "@mui/material"
import { Routes, Route } from "react-router-dom"
import Welcome from "./pages/Welcome"
import NotFound from "./pages/NotFound"
import SignIn from "./pages/SignIn"
import Header from "./components/Header"
import AboutUs from "./pages/AboutUs"
import ContactUs from "./pages/ContactUs"

const App = () => {
  return (
    <>
    <Header />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
