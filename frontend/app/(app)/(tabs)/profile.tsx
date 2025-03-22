import { useAuth } from "@/components/AuthContext";
import Screen from "@/components/Screen";
import { maroon } from "@/constants/Colors";
import { auth } from "@/FirebaseConfig";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image, ViewProps } from "react-native";
import PFP from "@/assets/images/profile-picture.png";

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

type UserHeaderProps = ViewProps & {
    username: string | undefined | null
};

function UserHeader({ username, style, ...rest }: UserHeaderProps) {
    return (
        <View style={[styles.userHeaderContainer, style]} { ...rest }>
            <Image style={ styles.profilePicStyle } source={PFP} />
            <Text style={styles.userDisplayName}>{ username }</Text>
        </View>
    );
}

export default function profile() {
    const { user, loading } = useAuth();

    const onSignOutPress = () => {
        auth.signOut()
    }

    return (
        <Screen style={styles.container}>
            <UserHeader username={ loading ? "Loading..." : user?.displayName } />
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
        gap: '20%'
    },
    userDisplayName: {
        fontSize: 40,
        fontWeight: 'bold',
        color: maroon, 
        flex: 1.5
    },
    logoutButtonContainer: {
        flexDirection: 'row', 
        backgroundColor: maroon,
        height: 42,
        alignItems: 'center',
        paddingHorizontal: '2%',
        borderRadius: 10,
        justifyContent: 'center',
        gap: '10%'
    },
    logoutIcon: {
        color: "white",
        position: 'absolute',
        left: '4%'
    },
    logoutText: {
        color: 'white',
        fontSize: 20
    },
    userHeaderContainer: { 
        flexDirection: 'row', 
        alignItems: 'center' 
    },
    profilePicStyle: {
        resizeMode: 'contain',
        height: 170,
        width: 170
    }
});