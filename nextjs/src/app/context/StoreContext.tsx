// src/app/context/StoreContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

// StoreContextTypeに storeName と user を追加
type User = {
    name: string;
    email: string;
};

type StoreContextType = {
    selectedStoreId: number | null;
    selectedCustomerId: number | null;
    storeName: string | null;  // 追加
    user: User | null;  // 追加
    setSelectedStoreId: (id: number | null) => void;
    setSelectedCustomerId: (id: number | null) => void;
    setStoreName: (name: string | null) => void;  // 追加
    setUser: (user: User | null) => void;  // 追加
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
    const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);
    const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
    const [storeName, setStoreName] = useState<string | null>(null);  // 追加
    const [user, setUser] = useState<User | null>(null);  // 追加

    return (
        <StoreContext.Provider value={{
            selectedStoreId,
            selectedCustomerId,
            storeName,  // 追加
            user,  // 追加
            setSelectedStoreId,
            setSelectedCustomerId,
            setStoreName,  // 追加
            setUser  // 追加
        }}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => {
    const context = useContext(StoreContext);
    if (!context) {
        throw new Error('useStore must be used within a StoreProvider');
    }
    return context;
};