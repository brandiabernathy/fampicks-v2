'use client';

import { createContext, useContext, useState } from "react";

const AppContext = createContext({
    user: {
        name: '',
        id: ''
    },
    setUser: (user: any) => {},
    week: 0,
    setWeek: (week: any) => {},
});

export const AppContextProvider = ({ children }: any) => {
    const [user, setUser] = useState({});
    const [week, setWeek] = useState(0);

    return (
        <AppContext.Provider value={{ user: { name: '', id: '' }, setUser, week, setWeek }}>
            {children}
        </AppContext.Provider>
    )
};

export const useAppContext = () => useContext(AppContext);