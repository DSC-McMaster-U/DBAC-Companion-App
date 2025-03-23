import Screen from "@/components/Screen";
import { ThemedText } from "@/components/ThemedText";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function DropinsScreen() {
    return (
        <Screen style={ styles.screen }>
            <View style={ styles.container }>
                <ThemedText type="title" style={ styles.title }>
                    Dropins
                </ThemedText>
            </View>
        </Screen>
    )
}

const styles = StyleSheet.create({
    screen: {
        backgroundColor: "white",
        flex: 1
    },
    container: {
        paddingHorizontal: 10
    },
    title: {
        marginTop: 10
    }
})