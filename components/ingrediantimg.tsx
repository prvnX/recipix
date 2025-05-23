import React from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

type props = {
  image: string;
};
export default function IngredientImg ({ image }: props) {
   function getImageLink(image: string) {
    image.replace(/ /g, "_");
    return 'https://www.themealdb.com/images/ingredients/' + image + '.png';
   }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: getImageLink(image) }}
        style={styles.image}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 100,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,  
    resizeMode: 'cover',
    shadowOffset: { width: 2, height: 1 },
    shadowOpacity: 0.1,
  }
} )