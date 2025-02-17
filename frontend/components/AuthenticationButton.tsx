import React from "react";
import { 
    TouchableOpacity, 
    View, 
    Image, 
    Text, 
    StyleProp, 
    ViewProps,
    ViewStyle, 
    TextStyle, 
    ImageSourcePropType,
    StyleSheet
} from "react-native";

type AuthenticationButtonProps = ViewProps & {
    title: string,
    icon?: ImageSourcePropType | undefined,
    backgroundColor: string,
    onPress: () => void,
    style?: StyleProp<ViewStyle>,
    textStyle?: StyleProp<TextStyle>
}

export default function AuthenticationButton({ title, icon, backgroundColor, onPress, style, textStyle }: AuthenticationButtonProps) {
    return (
        <TouchableOpacity 
            onPress={onPress} 
            style={[styles.authenticationButtonTouchableOpacity, { backgroundColor: backgroundColor }, style]}
        >
            <View style={styles.authenticationButtonView}>
                {
                    icon && (<Image source={icon} style={styles.authenticationButtonImage} />)
                }
                <Text style={[styles.authenticationButtonText, textStyle]}>{title}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    authenticationButtonTouchableOpacity: {
        flexDirection: 'row'
    },
    authenticationButtonView: {
        flex: 1, 
        paddingHorizontal: "3%", 
        paddingVertical: "1%", 
        flexDirection: "row", 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    authenticationButtonImage: {
        width: 35, 
        height: 35
    },
    authenticationButtonText: {
        fontSize: 30, 
        flex: 2, 
        textAlign: 'center'
    }
});