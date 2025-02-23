import { maroon, darkYellow } from "@/constants/Colors";
import React, { useState } from "react";
import { View, ViewProps, Text, StyleSheet, LayoutChangeEvent, TextStyle } from "react-native";
import { Svg, Circle, Defs, ClipPath } from 'react-native-svg';

type CircularProgressBarProps = ViewProps & {
    strokeWidth: number,
    label: string,
    progress: number,
    maxProgress?: number,
    displayValue?: string, // New prop to override the percentage text
    percentageTextStyle?: TextStyle,
    labelTextStyle?: TextStyle
}

export default function CircularProgressBar({
    strokeWidth,
    label,
    progress,
    maxProgress = 100,
    displayValue,
    percentageTextStyle = styles.defaultPercentageText,
    labelTextStyle = styles.defaultLabelText,
    ...rest
} : CircularProgressBarProps) {
    const [actualSize, setActualSize] = React.useState(0);

    const progressRatio = progress / maxProgress;

    const handleLayout = (event: LayoutChangeEvent) => {
        const { width } = event.nativeEvent.layout;
        setActualSize(width);
    };

    const radius = (actualSize - strokeWidth) / 2;
    const circumference = (radius * 2 * Math.PI) / 2;
    const circleProgress = progressRatio * circumference;

    const progressColor = 
        progressRatio <= 1 / 3 ? 'lime' :
        progressRatio <= 2 / 3 ? darkYellow :
        'red';

    return (
        <View style={styles.container} onLayout={handleLayout} { ...rest }>
            {actualSize > 0 && (
                <>
                    <View style={[styles.container, { width: actualSize, height: actualSize / 2 }]}>
                        <Svg width={actualSize} height={actualSize / 2}>
                            <Defs>
                                <ClipPath id="halfCircleClip">
                                    <Circle cx={actualSize / 2} cy={actualSize / 2} r={radius} />
                                </ClipPath>
                            </Defs>
                            <Circle
                                stroke='#e6e6e6'
                                fill="none"
                                cx={actualSize / 2}
                                cy={actualSize / 2}
                                r={radius}
                                strokeWidth={strokeWidth}
                                clipPath="url(#halfCircleClip)"
                            />
                            <Circle
                                stroke={progressColor}
                                fill="none"
                                cx={actualSize / 2}
                                cy={actualSize / 2}
                                r={radius}
                                strokeWidth={strokeWidth}
                                strokeDasharray={`${circleProgress} ${circumference}`}
                                strokeDashoffset={-circumference}
                                clipPath="url(#halfCircleClip)"
                            />
                        </Svg>

                        <Text style={[styles.centeredText, styles.centeredCircleText, percentageTextStyle, { fontSize: actualSize * 0.1 }]}>
                            {displayValue ? displayValue : `${Math.round(progressRatio * 1000) / 10}%`}
                        </Text>
                    </View>

                    <Text style={[styles.centeredText, labelTextStyle, { fontSize: actualSize * 0.13 }]}>
                        { label }
                    </Text>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center', 
        justifyContent: 'center'
    },
    centeredText: {
        textAlign: 'center',
    },
    centeredCircleText: {
        position: 'absolute',
        width: '100%',
        top: '60%'
    },
    defaultPercentageText: {
        fontWeight: 'bold'
    },
    defaultLabelText: {
        color: maroon,
        fontWeight: 'bold'
    }
});