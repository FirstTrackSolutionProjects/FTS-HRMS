import { Box } from "@mui/material"
import { Routes, Route, useLocation } from "react-router-dom"
import Welcome from "./pages/Welcome"
import NotFound from "./pages/NotFound"
import SignIn from "./pages/SignIn"
import Header from "./components/Header"
import AboutUs from "./pages/AboutUs"
import ContactUs from "./pages/ContactUs"
import { ToastContainer } from "react-toastify"
import Footer from "./components/Footer"
import ManagerDashboard from "./pages/ManagerDashboard"
const App = () => {
  const location = useLocation()
  return (
    <>
    <ToastContainer />
    {/* <Header /> */}
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/sign-in/*" element={<SignIn />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/admin-dashboard/*" element={<ManagerDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    {location.pathname == '/'? 
    <Footer />: null}
    </>
  )
}

export default App
