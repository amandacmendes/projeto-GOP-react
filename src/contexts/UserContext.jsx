// src/contexts/UserContext.jsx
import { createContext, useState } from 'react';

export const UserContext = createContext(0);

export function UserContextProvider({ children }) {

    const [user, setUser] = useState({
        name: 'username-teste',
        email: 'user@email.com ',
    });
    
    return (
        <UserContext.Provider
            value={{
                user,
                setUser
            }}
        >
            {children}
        </UserContext.Provider>
    );

}