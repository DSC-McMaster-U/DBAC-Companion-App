import { io, Socket } from "socket.io-client";
import { API_URL } from "../hooks/useBuildAPIURL";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface SocketContextType {
    socket: Socket | null
}

const SocketContext = createContext<SocketContextType | undefined>({ socket: null });

interface SocketProviderProps {
    children: ReactNode
}

export function SocketProvider({ children }: SocketProviderProps ) {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const newSocket = io(API_URL, { 
            autoConnect: false,
            transports: ["websocket"] // Force WebSockets
        });

        newSocket.connect();

        setSocket(newSocket);

        return () => { newSocket.disconnect() };
    }, []);

    return (
        <SocketContext.Provider value={{ socket }}>
            { children }
        </SocketContext.Provider>
    );
}

export function useSocket(): Socket | null {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context.socket;
}