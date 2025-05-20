import React from "react";
import { StyleSheet } from "react-native";
import { Image } from "expo-image";
import { View, Text } from "react-native";
import Header from '@/components/header';


export default function favourites() {
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <Header />
      <Text style={{ margin: "auto" }}>Favs</Text>
    </View>
  );
}