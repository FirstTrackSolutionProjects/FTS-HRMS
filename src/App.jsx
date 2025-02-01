import { Box } from "@mui/material"
import { Routes, Route } from "react-router-dom"
import Welcome from "./pages/Welcome"
import NotFound from "./pages/NotFound"
import SignIn from "./pages/SignIn"
import Header from "./components/Header"
import AboutUs from "./pages/AboutUs"
import ContactUs from "./pages/ContactUs"
import { ToastContainer } from "react-toastify"
import Footer from "./components/Footer"
const App = () => {
  return (
    <>
    <ToastContainer />
    <Header />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    <Footer />
    </>
  )
}

export default App
