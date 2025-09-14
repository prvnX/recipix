import { router, Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform,View,TouchableOpacity, Alert } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user,loading } = useAuth();

useEffect(() => {
  if (!loading) { // wait until user state is determined
    if (!user) {
      router.replace('/login');
    }
  }
}, [user, loading]);
  
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
          height: 55,
          width: 55,
          shadowRadius: 4,
          padding: 5,
          shadowColor:'black',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          borderWidth:1,
          borderColor:'#ff6200',
          elevation:10


        }}>
        <Ionicons
          size={25}
          name="sparkles"
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
          tabBarIcon: ({ color }) => <Ionicons size={28} name="nutrition" color={color} />,
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
