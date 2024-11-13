import React from "react";

import {
    View,
    Text,
    ViewProps,
    TextStyle,
    StyleSheet
} from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

type IconTextProps = ViewProps & {
    text: string,
    iconName: string,
    color: string,
    textStyle?: TextStyle
}

export default function IconText({ 
    text, 
    iconName, 
    color, 
    style, 
    textStyle={}, 
    ...rest 
} : IconTextProps) {
    return (
        <View style={[style, styles.container]} { ...rest }>
            <FontAwesome5 name={iconName} size={17} color={ color } solid />            
            <Text style={[textStyle, {color: color}]}>{ text }</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex', 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 5
    }
});