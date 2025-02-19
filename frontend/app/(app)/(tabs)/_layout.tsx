import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { StatusBar } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tabIconSelected,
          tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconNotSelected,
          headerShown: false,
          tabBarStyle: {
            backgroundColor: Colors[colorScheme ?? 'light'].tabBackground, // Set the background color here
          }
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => (
              <TabBarIcon name={'home'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="(pulse)"
          options={{
            title: 'Pulse',
            tabBarIcon: ({ color }) => (
              <FontAwesome6 name="dumbbell" size={25} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => (
              <FontAwesome6 name="user" size={25} color={color} solid />
            )
          }}
        />
      </Tabs>
    </>
  );
}
