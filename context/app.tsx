'use client';

import { createContext, useContext, useState } from "react";

const AppContext = createContext({})

export const AppContextProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [week, setWeek] = useState(0);

    return (
        <AppContext.Provider value={{ user, setUser, week, setWeek }}>
            {children}
        </AppContext.Provider>
    )
};

export const useAppContext = () => useContext(AppContext);