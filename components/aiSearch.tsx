import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { GoogleGenerativeAI } from '@google/generative-ai'; // Corrected import
const router = useRouter();

interface Props {
  setRecipie: void | any;
  setLoading: void | any;
  setRecipeTitle: void | any;
    setRecipeDescription: void | any;
    setRecipeIngredients: void | any;
    setRecipeInstructions: void | any;
    setAdditionalNotes: void | any;

  
}

export default function AISearch({ setRecipie, setLoading, setRecipeTitle, setRecipeDescription, setRecipeIngredients, setRecipeInstructions, setAdditionalNotes,  }: Props) {
  const [text, setText] = useState('');
  
  function handleTextChange(newText: string) {
    setText(newText);
  }
  async function handleSubmit() {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI('API_KEY');
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = `Find the recipe for ${text}. 
                        The recipe should serve for 4 people. 
                        Please provide a list of ingredients with exact amounts and clear, step-by-step cooking instructions. 
                        Response as just null if you cannot find the recipe.Give me only the best matched recipe.
                        Output the result only as a JSON array with the following format(Your response should be always only the JSON array or null, nothing else):
                        
                        [
                          {
                            "title": "<meal name>",
                            "description": "<small description of the meal>",
                            "serves": ,
                            "ingredients": [
                              "<ingredient 1 with amount>",
                              "<ingredient 2 with amount>",
                              "..."
                            ],
                            "instructions": [
                              "<step 1>",
                              "<step 2>",
                              "..."
                            ],
                            "additional_notes": "<any extra tips, variations, or serving suggestions>"
                          }
                        ]`;
        const result = await model.generateContent(prompt);
        console.log("AI response:", result.response.text());
        if(result.response.text()==="null") {
            Alert.alert('No recipe found', 'Please try a different search term.');
            setLoading(false);
            return;
        }
      const jsonStart = result.response.text().indexOf('[');
      const jsonEnd = result.response.text().lastIndexOf(']') + 1;
      if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error("Invalid response format");
      }
      const jsonString = result.response.text().substring(jsonStart, jsonEnd);
      const recipeData = JSON.parse(jsonString);
      if (!Array.isArray(recipeData) || recipeData.length === 0) {
        throw new Error("No recipe data found");
      }
      const recipeInfo = recipeData[0];
      console.log("Generated recipe:", recipeInfo);
      setRecipie(true);
      setRecipeTitle(recipeInfo.title || '');
      setRecipeDescription(recipeInfo.description || '');
      setRecipeIngredients(recipeInfo.ingredients || []);
      setRecipeInstructions(recipeInfo.instructions || []);
      setAdditionalNotes(recipeInfo.additional_notes || '');

    } catch (error) {
      Alert.alert('Error', 'Failed to fetch recipe from AI');
      console.error("AI fetch error:", error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <View style={styles.container}>
        <Ionicons name="sparkles-outline" size={20} color={'#acacac'}/>
      <TextInput
        style={styles.input}
        placeholder=  "Find Recipes with AI..."
        placeholderTextColor={"#acacac"}
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
    marginBottom: 5,
    borderRadius: 50,
    borderColor: '#acacac',
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