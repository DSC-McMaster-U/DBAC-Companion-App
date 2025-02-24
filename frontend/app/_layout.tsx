import { Redirect, Stack } from 'expo-router';
import { AuthProvider, useAuth } from '@/components/AuthContext';

function RootInner() {
    const { user, loading } = useAuth();

    if(!loading) {
        return <Redirect href={user ? "/(app)" : "/main"} />
    }
}

export default function Root() {
    return (
        <AuthProvider>
            <Stack screenOptions={{ headerShown: false, animation: "none" }} />
            <RootInner />
        </AuthProvider>
    );
}
