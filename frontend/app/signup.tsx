import React, { useState } from "react";
import { View, Text, SafeAreaView, TextInput, Button, StyleSheet } from "react-native";
import { auth } from "@/FirebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

export default function signup() {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');

    const signUpEmailPassword = async () => {
        try {
            // Register the user
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Update the users profile with their display name (First name Last Name)
            await updateProfile(user, {
                displayName: `${firstName} ${lastName}`
            });
        } catch(error: any) {
            console.log(error);
            alert("Registration Failed: " + error.message);
        }
    };

    return (
        <SafeAreaView style={styles.mainBody}>
            <View style={styles.container}>
                <View style={{ flexDirection: "row", width: "100%" }}>
                    <Text style={styles.signUpText}>Sign Up</Text>
                </View>
                <View style={{ width: "100%", gap: "10%" }}>
                    <TextInput 
                        value={firstName}
                        onChangeText={setFirstName}
                        placeholder={"First Name"}
                        placeholderTextColor="black"
                        style={{ borderWidth: 1, fontSize: 20 }}
                    />

                    <TextInput 
                        value={lastName}
                        onChangeText={setLastName}
                        placeholder={"Last Name"}
                        placeholderTextColor="black"
                        style={{ borderWidth: 1, fontSize: 20 }}
                    />
                    
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

                    <Button title="Sign Up" onPress={signUpEmailPassword} />
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
    signUpText: {
        fontSize: 30,
        fontWeight: "bold"
    }
});