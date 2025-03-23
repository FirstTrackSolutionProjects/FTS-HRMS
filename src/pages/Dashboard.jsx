import { Box } from "@mui/material";
import SideMenu from "../components/SideMenu/SideMenu";
import { Route, Routes } from "react-router-dom";
import { sidebarNavItems } from "../constants";
import { createElement } from "react";
import { useAuth } from "../contexts/AuthContext";

const Dashboard = () => {
    const { is_superadmin, permissions } = useAuth();
    const generateRoutes = (items) => {
        return items.flatMap((item, index) => {
            if (!is_superadmin && (item?.permissions?.length && !item.permissions.every(p => permissions.includes(p)))) 
                return [];
            const routes = [
            <Route
              key={item.to || `route-${index}`}
              path={item.to}
              element={item.component ? createElement(item.component) : null}
            />
          ];
          return routes;
        });
      };
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