import React, { createContext, createElement, useContext } from "react";
import { Route } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const RouteContext = createContext();

export const RouteProvider = ({ children }) => {
    const {is_superadmin, checkPermission} = useAuth();
    const generateRoutes = (items) => {
        return items.flatMap((item, index) => {
            console.log(item)
            if (!is_superadmin && (item?.permissions?.length && !item.permissions.every(p => checkPermission(p)))) 
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
        <RouteContext.Provider value={{ generateRoutes }}>
            {children}
        </RouteContext.Provider>
    );
};

export const useRoute = () => useContext(RouteContext);
