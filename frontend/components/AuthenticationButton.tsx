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
        width: 290,
        height: 56,
        justifyContent: 'center',
        borderRadius: 10,
    },
    authenticationButtonView: {
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center',
        columnGap: 5,
    },
    authenticationButtonImage: {
        width: 20, 
        height: 20
    },
    authenticationButtonText: {
        fontSize: 16,
        color: '#737373', 
        textAlign: 'center'
    }
});