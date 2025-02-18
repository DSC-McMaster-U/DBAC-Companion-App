import React, { useState } from "react";
import { Button, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import { auth } from "@/FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function signin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const signInEmailPassword = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch(error: any) {
            console.log(error);
            alert("SignIn Failed: " + error.message);
        }
    };

    return (
        <SafeAreaView style={styles.mainBody}>
            <View style={styles.container}>
                <View style={{ flexDirection: "row", width: "100%" }}>
                    <Text style={styles.signInText}>Sign In</Text>
                </View>
                <View style={{ width: "100%", gap: "10%" }}>
                    <TextInput 
                        value={email}
                        onChangeText={setEmail}
                        placeholder={"Email"}
                        placeholderTextColor="black"
                        style={{ borderWidth: 1, fontSize: 20 }}
                    />

                    <TextInput 
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={true}
                        placeholder={"Password"}
                        placeholderTextColor="black"
                        style={{ borderWidth: 1, fontSize: 20 }}
                    />

                    <Button title="Sign In" onPress={signInEmailPassword} />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mainBody: {
        flex: 1
    },
    container: {
        flex: 1, 
        width: "100%",
        paddingHorizontal: "2%",
        alignItems: 'center',
        justifyContent: 'center',
        gap: "10%"
    },
    signInText: {
        fontSize: 30,
        fontWeight: "bold"
    }
});