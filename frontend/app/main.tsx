import { Button, SafeAreaView, View, Image, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { darkYellow, maroon } from "@/constants/Colors";
import AuthenticationButton from "@/components/AuthenticationButton"
import MacMarauders from "@/assets/images/Macmarauders.png";
import GoogleLogo from "@/assets/images/google-logo.png";
import defaultpfp from "@/assets/images/default-pfp.png";
import lockIcon from "@/assets/images/lock-icon.png";
import letterF from "@/assets/images/letter-f.png";
import letterL from "@/assets/images/letter-l.png";

import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "@/FirebaseConfig";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

WebBrowser.maybeCompleteAuthSession();

export default function main() {
    const [isRegistering, setRegistering] = useState(false);

    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');

    const signInEmailPassword = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch(error: any) {
            console.log(error);
            alert("SignIn Failed: " + error.message);
        }
    };

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
            <View style={styles.centerDiv}>
                <Image style={styles.mauradersImage} source={MacMarauders} />
                <AuthenticationButton
                    title={"Continue with Google"}
                    backgroundColor="#ececec"
                    icon={GoogleLogo}
                    onPress={() => onGoogleSignInClick()}
                />
                <Text style={styles.textTheme}>OR</Text>
                {
                    !isRegistering ?
                    <>
                        <View style={styles.textFormView}>
                            <Image source={defaultpfp} style={{width:30, height:25}}/>
                            <TextInput
                                value={email}
                                onChangeText={setEmail}
                                placeholder={"email"}
                                placeholderTextColor="#737373"
                                style={{width:'100%', height: '100%'}}
                            />
                        </View>
                        <View style={styles.textFormView}>
                            <Image source={lockIcon} style={{width:30, height:25}}/>
                            <TextInput 
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={true}
                                placeholder={"password"}
                                placeholderTextColor="#737373"
                                style={{width:'100%', height: '100%'}}
                            />
                        </View>
                        <TouchableOpacity>
                            <Text style={styles.textTheme}>forgot password?</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => { signInEmailPassword() }}
                            style={styles.signInButton}>
                                <Text style={{color: 'white'}}>Sign in</Text>
                        </TouchableOpacity>
                    </>
                    :
                    <>
                        <View style={styles.textFormView}>
                            <Image source={letterF} style={{width:30, height:25}}/>
                            <TextInput
                                value={firstName}
                                onChangeText={setFirstName}
                                placeholder={"first name"}
                                placeholderTextColor="#737373"
                                style={{width:'100%', height: '100%'}}
                            />
                        </View>
                        <View style={styles.textFormView}>
                            <Image source={letterL} style={{width:30, height:25}}/>
                            <TextInput
                                value={lastName}
                                onChangeText={setLastName}
                                placeholder={"last name"}
                                placeholderTextColor="#737373"
                                style={{width:'100%', height: '100%'}}
                            />
                        </View>
                        <View style={styles.textFormView}>
                            <Image source={defaultpfp} style={{width:30, height:25}}/>
                            <TextInput
                                value={email}
                                onChangeText={setEmail}
                                placeholder={"email"}
                                placeholderTextColor="#737373"
                                style={{width:'100%', height: '100%'}}
                            />
                        </View>
                        <View style={styles.textFormView}>
                            <Image source={lockIcon} style={{width:30, height:25}}/>
                            <TextInput 
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={true}
                                placeholder={"password"}
                                placeholderTextColor="#737373"
                                style={{width:'100%', height: '100%'}}
                            />
                        </View>
                        <TouchableOpacity 
                            onPress={() => { signUpEmailPassword() }}
                            style={styles.signInButton}>
                                <Text style={{color: 'white'}}>Register</Text>
                        </TouchableOpacity>
                    </>
                }
                <TouchableOpacity
                onPress={() => setRegistering(!isRegistering)}>
                    {
                        !isRegistering ?
                        <Text style={{color:'#7a003c'}}>register</Text>
                        :
                        <Text style={{color:'#7a003c'}}>sign in</Text>
                    }
                </TouchableOpacity>
                {/* <AuthenticationButton 
                    title={"Sign Up"} 
                    backgroundColor={darkYellow}
                    onPress={onSignUpClick} 
                    style={styles.signInButton}/> */}
            </View>
            {/* <View style={styles.signInView}>
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
            </View> */}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    // signInView: {
    //     width: "100%", 
    //     gap: 20
    // },
    signInButton: {
        width: 163,
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 30,
        backgroundColor: '#7a003c'
    },
    mainBody: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        backgroundColor: 'white',
    },
    centerDiv: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        rowGap: 24,
    },
    mauradersImage: {
        width: 125,
        height: 132,
    },
    textFormView: {
        width: 290,
        height: 56,
        paddingLeft: 10,
        backgroundColor: '#ececec',
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 10,
    },
    textTheme: {
        color:'#737373'
    }
});