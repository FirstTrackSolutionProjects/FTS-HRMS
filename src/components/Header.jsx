import { Box, Typography, useMediaQuery } from "@mui/material"
import { headerNavItems } from "../constants"
import HeaderNavItem from "./HeaderNavItem"
import { FaUser } from "react-icons/fa"
import { Link } from "react-router-dom"
const Header = () => {
    return (
        <Box className="w-full sticky">
            <Box className="w-full flex h-16 bg-gray-100 relative px-16" gap={4}>
                <Box className="h-16 w-16 flex justify-center" p={1}>
                    <Box
                        component={'img'}
                        alt="Logo"
                        src="/logo.jpg"
                        className="h-full"
                    />
                </Box>
                <Box className="flex items-center font-semibold" gap={4}>
                    {headerNavItems.map((item) => (
                        <HeaderNavItem key={item.label} item={item} />
                    ))}
                </Box>
                <Link to={'/sign-in'}>
                    <Box className="absolute w-32 h-16 right-0 flex items-center justify-center" gap={1}>
                        <FaUser /><Typography className="hover:text-lg transition-all duration-500">login</Typography>
                    </Box>
                </Link>
            </Box>
        </Box>
    )
}

export default Header
