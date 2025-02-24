import { View, Image, StyleSheet } from "react-native";
import React from "react";
import MacMarauders from "@/assets/images/Macmarauders.png";

export default function index() {
    return (
        <View style={styles.container}>
            <Image source={MacMarauders} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: "white", 
        justifyContent: "center", 
        alignItems: "center"
    }
})