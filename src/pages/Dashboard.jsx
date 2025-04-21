import { Box } from "@mui/material";
import SideMenu from "@/components/SideMenu/SideMenu";
import { Routes } from "react-router-dom";
import { sidebarNavItems } from "../constants";
import { useRoute } from "@/contexts/RouteContext";

const Dashboard = () => {
    const { generateRoutes } = useRoute()
    return (
        <Box className="w-full h-screen  overflow-hidden flex">
            <Box className="h-screen overflow-hidden w-16 from-blue-700 bg-gradient-to-b to-blue-950">
                <SideMenu />
            </Box>
            <Box className={`h-screen w-[calc(100vw-64px)] overflow-y-auto overflow-x-hidden `}>
                <Routes>
                    {generateRoutes(sidebarNavItems)}
                </Routes>
            </Box>
        </Box>
    )
}

export default Dashboard;