import React, { useState } from "react";
import { StyleSheet, Pressable, Text, View, ScrollView, Alert,ImageBackground,TouchableOpacity , Share} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import Header from '@/components/header';
import Camera from "@/components/camera";
import AIHeader from "@/components/aiHeader";
import { Ionicons } from "@expo/vector-icons";
import { GoogleGenerativeAI } from '@google/generative-ai'; // Corrected import
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import AsyncStorage from "@react-native-async-storage/async-storage";
import AISearch from "@/components/aiSearch";



export default function Random() {
  const API_KEY = 'API_KEY';

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // Corrected and updated model name


  const [camera, setCamera] = useState(false);
  const [pic, setPic] = useState('');
  const [people, setPeople] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Analyzing your meal to create magic');
  
  const [recipe, setRecipe] = useState(false);
  const [recipeTitle, setRecipeTitle] = useState('');
  const [recipeDescription, setRecipeDescription] = useState('');
  const [recipeIngredients, setRecipeIngredients] = useState<string[]>([]);
  const [recipeInstructions, setRecipeInstructions] = useState<string[]>([]);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [servedPeople, setServedPeople] = useState(people);
  const [activeTab, setActiveTab] = useState<'Ingredients' | 'Instructions' | 'Additional Notes'>('Ingredients');

  async function generateContent() {
  const asset = Asset.fromModule(require('@/assets/images/testkottu.jpg'));
  await asset.downloadAsync();
    if (!pic) {
      Alert.alert("Error", "No picture selected.");
      return;
    }
    setLoading(true);
    setRecipe(false);
    showLoadingText();

    try {
      // 1. Read the image file from the URI and encode it to base64 (should add pic to here- for testing we add asset)
      const base64ImageData = await FileSystem.readAsStringAsync(asset.localUri!, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // 2. Define the prompt and the image part for the API
      const prompt = `Generate a recipe for the meal in this image. 
                        The recipe should serve ${people} ${people === 1 ? "person" : "people"}. 
                        Please provide a list of ingredients with exact amounts and clear, step-by-step cooking instructions. 
                        Response as just null if the meal is not recognizable.
                        Output the result only as a JSON array with the following format(Your response should be always only the JSON array or null, nothing else):
                        

                        [
                          {
                            "title": "<meal name>",
                            "description": "<small description of the meal>",
                            "serves": ${people},
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
      const imagePart = {
        inlineData: {
          mimeType: 'image/jpeg', // or 'image/png'
          data: base64ImageData,
        },
      };

      // 3. Call the API
      const result = await model.generateContent([prompt, imagePart]);
      const response = result.response;
      const text = response.text();
      if(text.includes("null")) {
        Alert.alert("Unrecognizable Meal", "The meal in the photo is not recognizable. Please try again with a different photo.");
        setLoading(false);
        return;
      }
      const jsonStart = text.indexOf('[');
      const jsonEnd = text.lastIndexOf(']') + 1;
      if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error("Invalid response format");
      }
      const jsonString = text.substring(jsonStart, jsonEnd);
      const recipeData = JSON.parse(jsonString);
      if (!Array.isArray(recipeData) || recipeData.length === 0) {
        throw new Error("No recipe data found");
      }
      const recipeInfo = recipeData[0];
      console.log("Generated recipe:", recipeInfo);
      setRecipeTitle(recipeInfo.title || '');
      setRecipeDescription(recipeInfo.description || '');
      setRecipeIngredients(recipeInfo.ingredients || []);
      setRecipeInstructions(recipeInfo.instructions || []);
      setAdditionalNotes(recipeInfo.additional_notes || '');
      setServedPeople(recipeInfo.serves || people)
      

      setRecipe(true); // Store the generated recipe in state to display it

    } catch (error) {
      console.error("Error generating content:", error);
      Alert.alert("API Error", "Failed to generate the recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function onPictureTaken(uri: string) {
    console.log("Picture taken:", uri);
    setPic(uri);
    setCamera(false);
  }

  function handleFindRecipe() {
    setCamera(true);
    setPic('');
  }
  async function shareRecipie() {
     try {
      await Share.share({

        message: `${recipeTitle}\n\nDescription: ${recipeDescription}\n\nServes: ${servedPeople}\n\nIngredients:\n${recipeIngredients.map(ing => `- ${ing}`).join('\n')}\n\nInstructions:\n${recipeInstructions.map((inst, idx) => `${idx + 1}. ${inst}`).join('\n')}\n\nAdditional Notes:\n${additionalNotes}\n\n(Recipe generated by Recipix AI)`,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  async function saveRecipe() {
  try {
    const newRecipe = {
      title: recipeTitle,
      description: recipeDescription,
      serves: servedPeople,
      ingredients: recipeIngredients,
      instructions: recipeInstructions,
      additionalNotes: additionalNotes,
      image: pic, // save the photo too
      date: new Date().toISOString(), // useful for sorting
    };

    // Get existing recipes
    const stored = await AsyncStorage.getItem('recipes');
    const recipes = stored ? JSON.parse(stored) : [];

    // Add new recipe
    recipes.push(newRecipe);

    // Save back
    await AsyncStorage.setItem('recipes', JSON.stringify(recipes));

    Alert.alert("Saved", "Recipe added to your saved AI recipes!");
  } catch (error) {
    console.error("Error saving recipe:", error);
    Alert.alert("Error", "Could not save the recipe.");
  }
}
  

  function handleClose() {
    setCamera(false);
    setPic('');
    setRecipe(false); // Clear recipe when canceling
  }

  function handleViewSavedRecipes() {
    alert("View Saved Recipes clicked!");
  }

  function showLoadingText() {
    setLoadingText('Analyzing your meal...');
    setTimeout(() => {
      setLoadingText('Generating your recipe...');
    }, 8000);
  }

  function handleGetRecipe() {
    generateContent();
    // The loading state is now handled inside generateContent
  }

  // NOTE: The rest of your component remains the same.
  // I'm omitting it for brevity but you should keep your JSX as is.
  // You would need to add a component to display the 'recipe' state variable.

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <AIHeader />
      {!pic && !camera && !loading && !recipe &&(
        <>
        <AISearch setRecipie={setRecipe} setLoading={setLoading}  setRecipeTitle={setRecipeTitle} setAdditionalNotes={setAdditionalNotes} setRecipeIngredients={setRecipeIngredients} setRecipeInstructions={setRecipeInstructions} setRecipeDescription={setRecipeDescription} />
        <View style={{ paddingHorizontal: 20, paddingTop: 20, marginTop: 40 }}>
       <Image source={require('@/assets/images/cooker.png')} style={{ width: 250, height: 250, resizeMode: 'contain', marginBottom: 5,alignSelf: 'center' }} />
      </View>
        <Text style={{ fontSize: 14, fontWeight: '300', marginLeft: 20,color: '#000000', fontFamily: '' ,marginTop: 20,alignSelf: 'center',textAlign: 'center',}}>
        Snap a photo of any meal, and instantly get a detailed recipe with ingredients and step-by-step cooking instructions!
        </Text>
        <View style={styles.optionsContainer}>
          <Pressable style={styles.button} onPress={handleFindRecipe}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Ionicons name="sparkles" size={24} color="white" />
              <Text style={styles.buttonText}>Snap & Find Recipe</Text>
            </View>
          </Pressable>
          <Pressable style={styles.button} onPress={handleViewSavedRecipes}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Ionicons name="bookmark" size={24} color="white" />
              <Text style={styles.buttonText}>View Saved Recipes</Text>
            </View>
          </Pressable>
        </View>
        </>
      )}

      {camera && (
        <Camera onPictureTaken={onPictureTaken} onClose={() => setCamera(false)} />
      )}

      {/* --- Updated recipe display with tabs --- */}
      {recipe && !loading && (
        <View style={{ flex: 1 }}>
                    <ImageBackground source={pic!=='' ? { uri: pic } : require('@/assets/images/default.png')} resizeMode="cover" style={styles.header}>
                      <View style={styles.headerInside}>
                        <LinearGradient
                          colors={['#00000000', '#000']}
                          style={styles.container}
                          start={{ x: 0.5, y: 0.6 }}
                          end={{ x: 0.5, y: 1 }}
                        >
                          <View style={styles.headerTopRow}>
                            <TouchableOpacity onPress={() => {setRecipe(false); setPic('');}}>
                              <Ionicons name="arrow-back" size={20} color="black" style={styles.icon} />
                            </TouchableOpacity>
                            <View style={{flexDirection:'row',gap:10}}>
                            <TouchableOpacity onPress={() => { Alert.alert('Already Added to Favourites') }}>
                              <Ionicons name="save-outline" size={20} color="#000000ff" style={styles.icon} />
                            </TouchableOpacity> 
                            <TouchableOpacity onPress={() => {shareRecipie() }}>
                              <Ionicons name="share-outline" size={20} color="#000000ff" style={styles.icon} />
                            </TouchableOpacity> 
                           </View>
                          </View>
                          <View style={styles.headerText}>
                            <Text style={[styles.textHead, { fontSize: 20 }]}>{recipeTitle}</Text>
                            <Text style={[styles.recipeText, { fontWeight: '300', fontSize: 12 ,color:'white'}]}>{recipeDescription}</Text>

                          </View>
                        </LinearGradient>
                      </View>
                    </ImageBackground>
          {/* Tabs */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', borderTopWidth: 1, borderTopColor: '#eee', backgroundColor: '#fff' }}>
            {['Ingredients', 'Instructions', 'Additional Notes'].map((tab) => (
              <Pressable
                key={tab}
                onPress={() => setActiveTab(tab as 'Ingredients' | 'Instructions' | 'Additional Notes')}
                style={{
                  paddingVertical: 12,
                  
                  borderBottomWidth: activeTab === tab ? 3 : 0,
                  borderBottomColor: '#ff9100',
                  flex: 1,
                  alignItems: 'center',
                  backgroundColor: activeTab === tab ? '#fff7e6' : 'white',
                }}
              >
                <Text style={{ color: activeTab === tab ? '#ff9100' : '#444', fontWeight: activeTab === tab ? '700' : '500', fontSize: 16 }}>
                  {tab}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Tab Content */}
          <ScrollView style={{ flex: 1, padding: 20,  backgroundColor: '#fff' }}>
            <View style={{paddingBottom: 50}}>
            {activeTab === 'Ingredients' && (
              <>
                {pic=='' ? (
                  <Text style={{alignSelf:'center' , marginBottom: 10,color: '#ff9100',fontSize:16,fontWeight:'400'}}>
                    <Text>Ingredients for </Text>
                    <Text style={{fontWeight:'700',fontSize:20,color:'#ff9100ff'}}>4</Text>
                    <Text> people</Text>
                  </Text>
                ):(
                  <Text style={{alignSelf:'center' , marginBottom: 10,color: '#ff9100',fontSize:16,fontWeight:'400'}}>
                    <Text>Ingredients for </Text>
                    <Text style={{fontWeight:'700',fontSize:20,color:'#ff9100ff'}}>{servedPeople}</Text>
                    <Text> {servedPeople === 1 ? <Text>person</Text> : <Text>people</Text>}</Text>
                  </Text>
                )
              }
                {recipeIngredients.map((ingredient, index) => (
                  <Text key={index} style={[styles.recipeText, styles.item]}>{ingredient}</Text>
                ))}
              </>
            )}
            {activeTab === 'Instructions' && (
              <>
                {recipeInstructions.map((instruction, index) => (
                  <Text key={index} style={[styles.recipeText, styles.item]}>{index + 1}) {instruction}</Text>
                ))}
              </>
            )}
            {activeTab === 'Additional Notes' && (
              <>
                <Text style={[styles.recipeText, styles.item]}>{additionalNotes || "No additional notes."}</Text>
                <Text style={[styles.recipeText, styles.item,{fontStyle: 'italic',color:'#ff8585ff',fontWeight: '800',borderColor: '#ff8585ff',borderWidth:2,backgroundColor: '#fff4f4ff'}]}>This recipe is AI-generated. Please verify ingredients, steps, and cooking times before use, as AI can make mistakes.</Text>
              </>
            )}
            </View>
          </ScrollView>
        </View>
      )}

      {pic && !camera && !recipe && !loading && (
        <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
          <Image source={{ uri: pic }} style={styles.takenImage} />
          <View style={styles.peopleSelector}>
            <Text style={{ fontWeight: '600', marginBottom: 10, color: '#ff9100' ,fontSize:20,}}>Number of people to serve</Text>
            <View style={{ flexDirection: 'row' ,marginBottom:20}}>
              {[1, 2, 4, 6 , 10].map((num) => (
                <Pressable
                  key={num}
                  style={[
                    styles.peopleOption,
                    people === num && { backgroundColor: '#ff9100', borderColor: '#ff9100' }
                  ]}
                  onPress={() => setPeople(num)}
                >
                  <Text style={[{ color: people === num ? 'white' : '#ff9100' ,alignSelf: 'center',fontWeight: '600'}]}>{num}</Text>
                </Pressable>
              ))}
              
            </View>
             <Pressable style={styles.button} onPress={handleGetRecipe}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Ionicons name="sparkles" size={24} color="white" />
              <Text style={styles.buttonText}>Get the recipe</Text>
            </View>
          </Pressable>
           <Pressable style={[styles.button,{backgroundColor: '#ffffff',borderWidth:1.5,borderColor: '#ff9100'}]} onPress={handleClose}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Ionicons name="close" size={24} color="#ff9100" />
              <Text style={[styles.buttonText,{color: '#ff9100'}]}>Cancel</Text>
            </View>
          </Pressable>
          </View>
        </ScrollView>
      )}

      {
        loading &&
        <View style={{ flex:1, justifyContent: 'center', paddingHorizontal: 20 }}>
       <Image source={require('@/assets/images/ailoading.gif')} style={{ width: 250, height: 250, resizeMode: 'contain', marginBottom: 10,alignSelf: 'center' }} />
        <Text style={{ fontSize: 18, fontWeight: '300',color: '#000000', fontFamily: '' ,marginTop: 20,alignSelf: 'center',textAlign: 'center',}}>{loadingText} </Text>
      </View>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  // takenImage: {
  //   width: 300,
  //   height: 300,
  //   marginVertical: 20,
  //   borderRadius: 15,
  //   alignSelf: "center",
  //   borderWidth: 1,
  //   borderColor: '#ff9100',
  //   shadowColor: "#000000",
  //   shadowOffset: { width: 0, height: 6 },
  //   shadowOpacity: 0.4,
  //   shadowRadius: 10,
  //   elevation: 10,
  // },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#FF7043",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 18,
    color: "#FFAB91",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#ff9100",
    paddingVertical: 15,
    paddingHorizontal: 35,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: "center",
    width: "100%",
    shadowColor: "#0000007e",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 6,
  },
  secondaryButton: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#FF7043",
    borderRadius: 25,
    paddingVertical: 22,
    paddingHorizontal: 35,
    marginVertical: 10,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  optionsContainer: {
    paddingHorizontal: 20,
    justifyContent: "center",
    flex: 1,
  },
  // recipeCard: {
  //   borderRadius: 15,
    
  //   marginTop: 20,
  //   width: "100%",
  //   shadowOpacity: 0.15,
  //   shadowRadius: 6,
  // },
  // recipeTitle: {
  //   fontSize: 24,
  //   fontWeight: "bold",
  //   marginBottom: 10,
  //   color: "#222",
  // },
  // recipeText: {
  //   fontSize: 14,
  //   color: "#444",
  //   lineHeight: 22,
  // },
  peopleSelector: {
    marginTop: 10,
    width: "100%",
    alignItems: "flex-start",
  },
  peopleOption: {
    width: 60,
    textAlign: "center",
    
    borderWidth: 1,
    borderColor: "#FF7043",
    borderRadius: 100, // Corrected to make it a circle
    height: 60, // Added to make it a circle
    justifyContent: 'center', // Center text vertically
    alignItems: 'center', // Center text horizontally
    marginRight: 12,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
  },
  recipeCard: {
    borderRadius: 15,
    backgroundColor: '#fff',
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 10,
  },
  recipeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#222',
  },
  recipeText: {
    fontSize: 16,
    color: '#010101ff',
    lineHeight: 22,
    marginBottom: 5,
  },
  takenImage: {
    width: '100%',
    height: 250,
    marginVertical: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ff9100',
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    color: '#FF7043',
  },
  header: {
    height: 200,
  },
  headerInside: {
    height: '100%',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  textHead: {
    color: '#fff',
    fontWeight: 'bold',
    shadowColor: '#000',
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 1,
  },
  headerText: {
    flexDirection: 'column',
    gap: 5,
    marginTop: 'auto',
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
  },
  icon: {
    backgroundColor: '#fff',
    padding: 7,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },


  item:{
    fontSize: 16,
    marginBottom: 10,
    color: '#222',
    borderWidth: 0.5,
    borderColor: '#ff9100',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fffcf5ff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 5,
  }
});
