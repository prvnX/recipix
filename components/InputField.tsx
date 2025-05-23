import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useRouter } from 'expo-router';
const router = useRouter();

export default function InputField() {
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
        console.log(meals);
        router.push(`/recipiedetails/${meals.idMeal}`);
      }
      else {
        Alert.alert('No results found', 'Please try a different search term.');
      }

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