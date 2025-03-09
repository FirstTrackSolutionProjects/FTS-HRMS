import React, { createContext, useState, useEffect, useContext } from "react";

export const HeightContext = createContext();

export const HeightProvider = ({ children }) => {
    const [height, setHeight] = useState(window.innerHeight);

    useEffect(() => {
        const handleResize = () => setHeight(window.innerHeight);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <HeightContext.Provider value={{ height }}>
            {children}
        </HeightContext.Provider>
    );
};

export const useHeight = () => useContext(HeightContext);
