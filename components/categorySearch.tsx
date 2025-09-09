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
  changeCategory: void | any;
  
}

export default function categorySearch({ changeCategory }: Props) {
  const [text, setText] = useState('');
  
  function handleTextChange(newText: string) {
    setText(newText);
  }
  function handleSubmit() {
    changeCategory(text);



  
  }
  return (
    <View style={styles.container}>
        <Ionicons name="search-outline" size={20} color={'#ccc'}/>
      <TextInput
        style={styles.input}
        placeholder="Search for Categories..."
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