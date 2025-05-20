import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function InputField() {
  const [text, setText] = useState('');
  function handleTextChange(newText: string) {
    setText(newText);
  }
  function handleSubmit() {
if(text.trim() !== '') {

    Alert.alert('Text Submitted', `You typed: ${text}`);
    // Handle form submission
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