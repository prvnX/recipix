import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useRouter } from 'expo-router';
const router = useRouter();
type Meal = {
  id: string;
  name: string;
  area: string;
  category: string;
  image: string;
};

interface Props {
  setMealData: React.Dispatch<React.SetStateAction<Meal[]>>;
  setTitleText: void | any;
}

export default function InputField({ setMealData,setTitleText }: Props) {
  const [text, setText] = useState('');
  function handleTextChange(newText: string) {
    setText(newText);
  }
  function handleSubmit() {
if(text.trim() !== '') {
    axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${text}`).
    then((response) => {
      const meals = response.data.meals;
      if(meals!== null) {
        const mealData: Meal[] = meals.map((meal: any) => ({
          id: meal.idMeal,
          name: meal.strMeal,
          area: meal.strArea,
          category: meal.strCategory,
          image: meal.strMealThumb,
        }));
        setMealData(mealData);
        setTitleText(`Search results for "${text}"`);
      }
      else {
        Alert.alert(
          'No results found',
          'Please try a different search term.',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Try AI Search',
              onPress: () => {
                // Optional: clear text or focus input again
                // Optional: clear text or focus input again
                router.push('/random');
              },
            },
          ],
          { cancelable: true }
        );      }

    })
    .catch((error) => {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch meals');
    });
    setText('');
  }
  }
  return (
    <View style={styles.container}>
        <Ionicons name="search-outline" size={20} color={'#ccc'}/>
      <TextInput
        style={styles.input}
        placeholder="Search for Recipies..."
        placeholderTextColor={"#afaeae"}
        value={text}
        onChangeText={handleTextChange} 
        onSubmitEditing={handleSubmit} // Call handleSubmit when the user submits the text
        returnKeyType="done" // Show "Done" button on the keyboard
        />
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor:"white",
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.2,
    margin:20,
    borderRadius: 50,
    borderColor: '#afaeae',
    paddingLeft: 10,
    
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: 'transparent',
    padding: 15,
    paddingLeft:5,
    color:'black',
    borderRadius: 25,
    width: '95%'
  },
});