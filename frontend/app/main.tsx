import { View, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { darkYellow, maroon } from "@/constants/Colors";
import AuthenticationButton from "@/components/AuthenticationButton"
import GoogleLogo from "@/assets/images/google-logo.png";

import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "@/FirebaseConfig";

WebBrowser.maybeCompleteAuthSession();

export default function main() {
    const router = useRouter();

    const onSignInClick = () => {
        router.navigate("/signin");
    };

    const onSignUpClick = () => {
        router.navigate("/signup");
    };

    // Setup google auth callback method
    const [request, response, onGoogleSignInClick] = Google.useAuthRequest({
        clientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_ID,
        iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_ID,
        androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_ID
    });

    // Handles google auth response
    useEffect(() => {
        if (response?.type === "success") {
            const { id_token } = response.params;
            const credential = GoogleAuthProvider.credential(id_token);
            signInWithCredential(auth, credential)
                .then((userCredential) => {})
                .catch((error) => console.error(error));
        }
    }, [response])

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

                <AuthenticationButton
                    title={"Google Sign In"}
                    backgroundColor="#F2F2F2"
                    icon={GoogleLogo}
                    onPress={() => onGoogleSignInClick()}
                    style={styles.signInButton}
                    textStyle={styles.googleSignInButtonText}
                />
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
    googleSignInButtonText: {
        color: "#1F1F1F"
    },
    mainBody: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        backgroundColor: "white"
    }
});