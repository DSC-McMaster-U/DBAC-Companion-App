import React from "react";

import { Stack } from "expo-router";

export default function PulseLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="equipmenttabularmenu" />
        </Stack>
    );
}