import { View, StyleSheet } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { darkYellow, maroon } from "@/constants/Colors";
import AuthenticationButton from "@/components/AuthenticationButton"

export default function main() {
    const router = useRouter();

    const onSignInClick = () => {
        router.navigate("/signin");
    };

    const onSignUpClick = () => {
        router.navigate("/signup");
    }

    return (
        <SafeAreaView style={styles.mainBody}>
            <View style={styles.signInView}>
                <AuthenticationButton 
                    title={"Sign In"} 
                    backgroundColor={maroon}
                    onPress={onSignInClick} 
                    style={styles.signInButton}
                    textStyle={styles.signInButtonText} />

                <AuthenticationButton 
                    title={"Sign Up"} 
                    backgroundColor={darkYellow}
                    onPress={onSignUpClick} 
                    style={styles.signInButton}
                    textStyle={styles.signInButtonText} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    signInView: {
        width: "100%", 
        gap: 20
    },
    signInButton: {
        marginHorizontal: 20, 
        borderRadius: 20
    },
    signInButtonText: {
        color: "white"
    },
    mainBody: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1 
    }
});