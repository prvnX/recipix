import { Tabs } from 'expo-router';
import React from 'react';
import { Platform,View,TouchableOpacity, Alert } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FFB74D' ,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: '#fff',
          paddingBottom: 10,
          shadowOpacity: 0.1,
          shadowRadius: 6,
          paddingTop: 10,
          shadowColor: 'black',
          shadowOffset: { width: 0, height: 2 },
          borderTopWidth: 0.2,
          borderColor: '#ccc',
        },
  
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="grid" color={color} />,

        }}
      />
       <Tabs.Screen
  name="random"
  options={{
    title: '',
    tabBarIcon: ({ color, focused }) => (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
          borderRadius: 35,
          height: 50,
          width: 50,
          shadowRadius: 4,
          padding: 5,
          shadowColor:'black',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          borderWidth:0.5,
          borderColor:'#ff6200'

        }}>
        <Ionicons
          size={30}
          name="flame"
          color={focused ? '#ff6200' : '#ff6200'}
        />
      </View>
    ),
    tabBarLabelStyle: {
      display: 'none',
    },
  }}
/>
<Tabs.Screen
        name="search"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="search" color={color} />,
        }}
      />


       <Tabs.Screen
        name="favourites"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="heart" color={color} />,
        }}
      />


     
    </Tabs>
  );
}
