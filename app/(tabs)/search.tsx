import React from "react";
import { StyleSheet } from "react-native";
import {View , Text} from "react-native";
import Header from '@/components/header';


export default function SearchScreen() {
  return (
    <View style={{flex:1,backgroundColor:"white" }}>
      <Header />
      <Text style={{margin:'auto'}}>Search</Text>
    </View>
  );
}
