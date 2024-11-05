import React from "react";
import { StyleSheet, View, Text, TextStyle, ViewProps } from "react-native";
import Checkbox from "expo-checkbox";

type CheckBoxProps = ViewProps & {
    text: string,
    textStyle?: TextStyle,
    value: boolean,
    onValueChange: (arg0: boolean) => void,
    color: string
}

export default function CheckBox({ text, textStyle, value, onValueChange, color, style, ...rest } : CheckBoxProps) {
    return (
        <View style={[styles.checkboxViewStyle, style]} { ...rest }>
            <Checkbox 
                value={value}
                onValueChange={onValueChange}
                color={color} />
            <Text style={textStyle}>{ text }</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    checkboxViewStyle: {
        flexDirection: 'row', 
        gap: 5
    }
})