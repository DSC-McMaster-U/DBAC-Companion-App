import React from 'react';
import { ViewProps } from 'react-native';
import Animated, {
    useAnimatedRef
} from 'react-native-reanimated';

type ScrollViewProps = ViewProps & {
    background: string
}

export default function ScrollView({background, children, ...rest} : ScrollViewProps) {
    return (
        <Animated.ScrollView style={{backgroundColor: background}} { ...rest }>
            { children }
        </Animated.ScrollView>
    );
}