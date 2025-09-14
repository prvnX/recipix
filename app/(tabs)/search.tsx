import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ImageBackground,
  Pressable
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { fridgeItems } from "@/assets/ingredients/fridgeItems";
import AIHeader from "@/components/aiHeader";
import Header from "@/components/header";
import { Ionicons } from "@expo/vector-icons";
import FridgeImage from "@/components/frideimage";
import { GoogleGenerativeAI } from '@google/generative-ai'; // Corrected import


export default function SearchScreen({ }) {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mealList, setMealList] = useState<any[]>([]);
  const [recipe, setRecipe] = useState(false);
  const [recipeTitle, setRecipeTitle] = useState('');
  const [recipeDescription, setRecipeDescription] = useState('');
  const [recipeIngredients, setRecipeIngredients] = useState<string[]>([]);
  const [recipeInstructions, setRecipeInstructions] = useState<string[]>([]);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [activeTab, setActiveTab] = useState('ingredients');

  const [servedPeople, setServedPeople] = useState(0);
          const genAI = new GoogleGenerativeAI('YOUR_API_KEY_HERE');
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      


  interface FridgeItem {
    id: number;
    name: string;
    image: string;
  }

    async function handleItemClick(text: string) {
      if (!text.trim()) return;
      setIsLoading(true);
      try {
          const prompt = `Find the recipe for ${text}. 
                          The recipe should serve for 4 people.
                          ${selectedItems.length > 0 ? `Use these ingredients: ${selectedItems.map(
                            (id) => fridgeItems.find((i) => i.id === id)?.name ?? ""
                          ).join(", ")}` : ""}
                          Use the following ingredients if needed: pepper, salt, chillie, water, oil, butter, garlic, onion, lemon, sugar, ice cubes.
                          Please provide a list of ingredients with exact amounts and clear, step-by-step cooking instructions. 
                          Response as just null if you cannot find the recipe.Give me only the best matched recipe.
                          Output the result only as a JSON array with the following format(Your response should be always only the JSON array or null, nothing else):
                          
                          [
                            {
                              "title": "<meal name>",
                              "description": "<small description of the meal (max 20 words)>",
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
              setIsLoading(false);
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
        setRecipe(true);
        setRecipeTitle(recipeInfo.title || '');
        setRecipeDescription(recipeInfo.description || '');
        setRecipeIngredients(recipeInfo.ingredients || []);
        setRecipeInstructions(recipeInfo.instructions || []);
        setAdditionalNotes(recipeInfo.additional_notes || '');
  
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch recipe from AI');
        console.error("AI fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    }
  const toggleSelect = (id: number) => {
    setSelectedItems((prev: number[]) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const suggestRecipes = async () => {
    const selectedNames = selectedItems.map(
      (id) => fridgeItems.find((i) => i.id === id)?.name ?? ""
    );
    console.log("Selected Ingredients:", selectedNames);
    setIsLoading(true);
    try {

          const prompt = `List all possible meal names that can be made using these ingredients: ${selectedNames.join(", ")}. 
                            You can use the ingredients individually or combined in any way. 
                            You may also use these common ingredients if needed: pepper, salt, chillie, water, oil, butter, garlic, onion, lemon, sugar, ice cubes. 
                            If no meals can be made, respond with null. 
                            Output strictly as a JSON array in this format (your response must be only the JSON array or null):

                            [
                              { "title": "<meal name>" },
                              { "title": "<meal name>" },
                              { "title": "<meal name>" }
                            ]`;
          const result = await model.generateContent(prompt);
          console.log("AI response:", result.response.text());
          if(result.response.text()==="null") {
              Alert.alert('No recipe found', 'Please try a different search term.');
              return;
          }
        const jsonStart = result.response.text().indexOf('[');
        const jsonEnd = result.response.text().lastIndexOf(']') + 1;
        if (jsonStart === -1 || jsonEnd === -1) {
          throw new Error("Invalid response format");
        }
        const jsonString = result.response.text().substring(jsonStart, jsonEnd);
        const recipieList = JSON.parse(jsonString);
        if (!Array.isArray(recipieList) || recipieList.length === 0) {
          throw new Error("No recipe data found");
        }

        console.log("Generated recipes:", recipieList);
        setMealList(recipieList);

      } catch (error) {
        Alert.alert('Error', 'Failed to fetch recipe from AI');
        console.error("AI fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    }


  return (
    <LinearGradient colors={["#fff", "#fff"]} style={styles.container}>

      <View style={{ flex: 1 }}>


      <Header/>
      {
        mealList.length == 0 && !isLoading &&
        <>
      
        <Text style={{ fontSize: 20, fontWeight: '700', marginLeft: 20,color: '#000000', fontFamily: '' }} >
          Pick ingredients to get recipes                  
          </Text>
        <FlatList
          data={fridgeItems}
          numColumns={6}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const isSelected = selectedItems.includes(item.id);
            return (
              <TouchableOpacity
                onPress={() => toggleSelect(item.id)}
                style={[
                  styles.itemCard,
                  isSelected && styles.selectedCard,
                  
                ]}
              >
                <FridgeImage uri={item.image} style={styles.image} />
                <Text style={styles.name}>{item.name}</Text>
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={styles.grid}
        />

        {/* Frosted Glass Suggest Button */}
        {selectedItems.length > 0 && 
        <View style={
          styles.bucket

        }>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ alignItems: "center", paddingHorizontal: 10 }}>
          {selectedItems.length === 0 ? (
            <Text style={{ color: "#888", fontSize: 12 }}>No items selected</Text>
          ) : (
            selectedItems.map((id) => {
              const item = fridgeItems.find((i) => i.id === id);
              if (!item) return null;
              return (
                
                <View key={id} style={{ alignItems: "center", marginRight: 8 }}>
                  <FridgeImage uri={item.image} style={{ width: 30, height: 30, borderRadius: 15 }} />
                </View>
              );
            })
          )}
        </ScrollView>
        </View>
}
        <TouchableOpacity style={styles.suggestBtn} onPress={suggestRecipes} disabled={selectedItems.length === 0}>
          <Ionicons name="sparkles" size={18} color="white" />
          <Text style={[styles.suggestText,{fontSize: 16}]}>Suggest Recipes
            {
              selectedItems.length > 0 ? ` (${selectedItems.length} Ingredients)` : ''
            }

          </Text>
        </TouchableOpacity>
        </>
      }
      {
        isLoading &&
                <View style={{ flex:1, justifyContent: 'center', paddingHorizontal: 20,zIndex: 10 }}>
               <Image source={require('@/assets/images/ailoading.gif')} style={{ width: 250, height: 250, resizeMode: 'contain', marginBottom: 10,alignSelf: 'center' }} />
                <Text style={{ fontSize: 18, fontWeight: '300',color: '#000000', fontFamily: '' ,marginTop: 20,alignSelf: 'center',textAlign: 'center',}}> Finding the Best Matching Recipies for your Ingredients </Text>
              </View>

      }



      {
        mealList.length > 0 && !isLoading && !recipe &&
        <>

        <View style={
        { display: "flex", flexDirection: "row", alignItems: "center", backgroundColor: "#fffcf5", borderRadius: 16, padding: 20,margin:8, minHeight: 40, shadowColor: "#000", shadowOpacity: 0.08, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 2 }
        }>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ alignItems: "center", paddingHorizontal: 10 }}>
          {
            selectedItems.map((id) => {
              const item = fridgeItems.find((i) => i.id === id);
              if (!item) return null;
              return (
                
                <View key={id} style={{ alignItems: "center", marginRight: 8 }}>
                  <FridgeImage uri={item.image} style={{ width: 40, height: 40, borderRadius: 15 }} />
                </View>
              );
            })
          }
        </ScrollView>
        </View>
        <FlatList
  data={mealList}
  keyExtractor={(item, index) => index.toString()}
  showsVerticalScrollIndicator={false}
  renderItem={({ item }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      style={{
        marginVertical: 8,
        marginHorizontal: 12,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#fff5eb',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
      }}
      onPress={() => handleItemClick(item.title)}
    >
      <LinearGradient
        colors={['#fff5eb', '#ffe6cc']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ padding: 16, flexDirection: 'row', alignItems: 'center' }}
      >
                {/* Optional Icon/Image */}
                <View
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: '#ffcc99',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 16,
                  }}
                >
                  <Text style={{ fontSize: 20, color: '#fff', fontWeight: '700' }}>
                    🍽
                  </Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '700',
                      color: '#333',
                      marginBottom: 4,
                    }}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      color: '#666',
                    }}
                  >
                    Tap to view recipe details
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          )}
          contentContainerStyle={{
            paddingBottom: 100,
            backgroundColor: '#fffbf6',
          }}
/>
        <TouchableOpacity style={styles.suggestBtn} onPress={() => setMealList([])}>
          <Ionicons name="arrow-back" size={18} color="white" />
          <Text style={[styles.suggestText,{fontSize: 16}]}>Back to Ingredients</Text>
        </TouchableOpacity>
        </>
      }


            {recipe && !isLoading && (
              <View style={{ flex: 1 }}>
                          <ImageBackground source={ require('@/assets/images/default.png')} resizeMode="cover" style={styles.header}>
                            <View style={styles.headerInside}>
                              <LinearGradient
                                colors={['#00000000', '#000']}
                                style={styles.container}
                                start={{ x: 0.5, y: 0.6 }}
                                end={{ x: 0.5, y: 1 }}
                              >
                                <View style={styles.headerTopRow}>
                                  <TouchableOpacity onPress={() => {setRecipe(false);}}>
                                    <Ionicons name="arrow-back" size={20} color="black" style={styles.icon} />
                                  </TouchableOpacity>
                                  <View style={{flexDirection:'row',gap:10}}>
                                  <TouchableOpacity onPress={() => { Alert.alert('Already Added to Favourites') }}>
                                    <Ionicons name="save-outline" size={20} color="#000000ff" style={styles.icon} />
                                  </TouchableOpacity> 
                                  <TouchableOpacity onPress={() => {}}>
                                    <Ionicons name="share-outline" size={20} color="#000000ff" style={styles.icon} />
                                  </TouchableOpacity> 
                                 </View>
                                </View>
                                <View style={[styles.headerText, {padding: 20}]}>
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
                        <Text style={{alignSelf:'center' , marginBottom: 10,color: '#ff9100',fontSize:16,fontWeight:'400'}}>
                          <Text>Ingredients for </Text>
                          <Text style={{fontWeight:'700',fontSize:20,color:'#ff9100ff'}}>4</Text>
                          <Text> people</Text>
                        </Text>
                        <View style={{ marginBottom: 20 }}>
                          {recipeIngredients.map((ingredient, index) => (
                            <Text key={index} style={[styles.recipeText, styles.item]}>{ingredient}</Text>
                          ))}
                        </View>
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
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: "#003366",
  },
  grid: {
    paddingBottom: 100,
    borderWidth:1,
    borderColor:'#ccc',
    margin:10,
    borderRadius:10,
    padding:10
  },
  itemCard: {
    flex: 1,
    margin: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedCard: {
    backgroundColor: "#e4e4e4",
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "#a6a6a6",


  },
  image: {
    width: 50,
    height: 50,
    marginBottom: 6,
    resizeMode: "contain",
  },
  name: {
    fontSize: 9,
    fontWeight: "400",
    textAlign: "center",
    color: "#333",
  },
  suggestBtn: {
    position: "absolute",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#ff9100f4",
    paddingVertical: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 6,
    elevation: 6,
  },
  suggestText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  bucket: {
            flexDirection: "row", 
          alignItems: "center", 
          position: "absolute", 
          bottom: 80, 
          left: 20, 
          right: 20, 
          backgroundColor: "rgba(255,255,255,0.85)", 
          borderRadius: 16, 
          padding: 8, 
          minHeight: 40, 
          shadowColor: "#000", 
          shadowOpacity: 0.08, 
          shadowOffset: { width: 0, height: 2 }, 
          shadowRadius: 4, 
          elevation: 2 
  },

  recipeText: {
    fontSize: 16,
    color: '#010101ff',
    lineHeight: 22,
    marginBottom: 5,
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