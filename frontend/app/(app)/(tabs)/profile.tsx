import { useAuth } from "@/components/AuthContext";
import Screen from "@/components/Screen";
import { auth } from "@/FirebaseConfig";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, ViewProps } from "react-native";

type LogoutButtonProps = ViewProps & {
    onPress: () => void
}

function LogoutButton({ onPress } : LogoutButtonProps) {
    return (
        <TouchableOpacity onPress={onPress} style={styles.logoutButtonContainer}>
            <FontAwesome6 name="right-from-bracket" style={styles.logoutIcon} size={25} solid />
            <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
    )
}

export default function profile() {
    const { user, loading } = useAuth();

    const onSignOutPress = () => {
        auth.signOut()
    }

    return (
        <Screen style={styles.container}>
            <Text style={styles.userDisplayName}>{ loading ? "Loading..." : user?.displayName }</Text>
            <LogoutButton onPress={onSignOutPress} />
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: '2%',
        paddingVertical: '2%',
        justifyContent: 'space-between'
    },
    userDisplayName: {
        fontSize: 40,
        fontWeight: 'bold'
    },
    logoutButtonContainer: {
        flexDirection: 'row', 
        backgroundColor: 'red', 
        alignItems: 'center',
        paddingHorizontal: '2%',
        borderRadius: 5,
        justifyContent: 'center',
        gap: '10%'
    },
    logoutIcon: {
        color: "white"
    },
    logoutText: {
        color: 'white',
        fontSize: 20
    }
});