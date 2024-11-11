import React from "react";
import { StyleSheet, StatusBar, View, ViewProps, StyleProp } from "react-native";
import Constants from "expo-constants";

type ScreenProps = ViewProps & {
    style?: StyleProp<ViewProps>
}

// Represents a screen within the app
export default function Screen({style, children, ...rest} : ScreenProps) {
    return (
        <View style={[styles.container, style]} { ...rest }>
            { children }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: Constants.statusBarHeight // Move body of screen under status bar
    }
});