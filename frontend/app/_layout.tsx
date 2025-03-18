import { Redirect, Stack } from 'expo-router';
import { AuthProvider, useAuth } from '@/components/AuthContext';
import { SocketProvider } from '@/components/SocketContext';

function RootInner() {
    const { user, loading } = useAuth();

    if(!loading) {
        return <Redirect href={user ? "/(app)" : "/main"} />
    }
}

export default function Root() {
    return (
        <AuthProvider>
            <SocketProvider>
                <Stack screenOptions={{ headerShown: false, animation: "none" }} />
                <RootInner />
            </SocketProvider>
        </AuthProvider>
    );
}
