import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Image, Alert, Share, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AIHeader from "@/components/aiHeader";
import AiItemView from "@/components/Aiitemview";

interface Recipe {
  title: string;
  description: string;
  serves: number;
  ingredients: string[];
  instructions: string[];
  additionalNotes: string;
  image?: string | null;
  date: string;
}

export default function SavedAIRecipes() {
  const { user } = useAuth();
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [recipeClick,setRecipeClick] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    fetchRecipes();
  }, [user]);

  async function fetchRecipes() {
    try {
      const stored = await AsyncStorage.getItem(`AIrecipes_${user?.email}`);
      const parsed = stored ? JSON.parse(stored) : [];
      // sort by latest first
      console.log(parsed);
      parsed.sort((a: Recipe, b: Recipe) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setRecipes(parsed);
      console.log(await AsyncStorage.getAllKeys());
    } catch (error) {
      console.error("Failed to load recipes", error);
    }
  }

  async function shareRecipe(recipe: Recipe) {
    try {
      await Share.share({
        message: `${recipe.title}\n\nDescription: ${recipe.description}\n\nServes: ${recipe.serves}\n\nIngredients:\n${recipe.ingredients.map(ing => `- ${ing}`).join("\n")}\n\nInstructions:\n${recipe.instructions.map((inst, idx) => `${idx + 1}. ${inst}`).join("\n")}\n\nAdditional Notes:\n${recipe.additionalNotes}`,
      });
    } catch (error) {
      console.error("Error sharing recipe:", error);
    }
  }

  async function deleteRecipe(index: number) {
    Alert.alert(
      "Delete Recipe",
      "Are you sure you want to delete this recipe?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const updated = [...recipes];
              updated.splice(index, 1);
              setRecipes(updated);
              await AsyncStorage.setItem(`AIrecipes_${user?.email}`, JSON.stringify(updated));
            } catch (error) {
              console.error("Failed to delete recipe:", error);
            }
          },
        },
      ]
    );
  }

  function handleViewRecipe(recipe: Recipe) {
    setSelectedRecipe(recipe);
    setRecipeClick(false);
  }

  function handleBack() {
    setRecipeClick(true);
    setSelectedRecipe(null);
  }

  async function handleSave(updatedRecipe: Recipe) {
    if (!selectedRecipe) return;
    try {
      const updated = recipes.map((r) =>
        r.date === selectedRecipe.date ? updatedRecipe : r
      );
      setRecipes(updated);
      await AsyncStorage.setItem(`AIrecipes_${user?.email}`, JSON.stringify(updated));
      setSelectedRecipe(updatedRecipe);
    } catch (error) {
      console.error("Failed to save recipe:", error);
    }
  }

  async function handleShare() {
    if (!selectedRecipe) return;
    shareRecipe(selectedRecipe);
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <AIHeader />

      {
        recipeClick ?
        (
            <>
      

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {recipes.length === 0 && (
          <View style={{justifyContent:'center',marginVertical:100,flex:1,}}>

          <Ionicons name="clipboard-outline" size={100} color={'#626262'} style={{alignSelf:'center'}} />
          <Text style={{ textAlign: "center", marginTop: 50, fontSize: 20, color: "#626262" }}>
            You have no saved recipes yet. Snap a photo and get started!
          </Text>
          
          
          </View>
        )}

        {recipes.map((recipe, index) => (
          <View key={index} style={styles.recipeCard}>
            <Image
              source={recipe.image ? { uri: recipe.image } : require('@/assets/images/default.png')}
              style={styles.recipeImage}
            />
            <View style={styles.recipeInfo}>
              <Text style={styles.recipeTitle}>{recipe.title}</Text>
              <Text style={styles.recipeDescription}>{recipe.description}</Text>
              <Text style={styles.recipeServes}>Serves: {recipe.serves}</Text>
            </View>

            <View style={styles.actionsRow}>
              <Pressable
                style={styles.actionButton}
                onPress={() => handleViewRecipe(recipe)}
              >
                <Ionicons name="eye-outline" size={20} color="#ff9100" />
                <Text style={styles.actionText}>View</Text>
              </Pressable>

              <Pressable style={styles.actionButton} onPress={() => shareRecipe(recipe)}>
                <Ionicons name="share-outline" size={20} color="#ff9100" />
                <Text style={styles.actionText}>Share</Text>
              </Pressable>

              <Pressable style={styles.actionButton} onPress={() => deleteRecipe(index)}>
                <Ionicons name="trash-outline" size={20} color="#ff8585" />
                <Text style={[styles.actionText, { color: "#ff8585" }]}>Delete</Text>
              </Pressable>
            </View>
          </View>
        ))}

      </ScrollView>
                <TouchableOpacity style={styles.suggestBtn} onPress={() => (router.push('/random'))}>
                <Ionicons name="arrow-back" size={18} color="white" />
                <Text style={[styles.suggestText,{fontSize: 16}]}>Back to Recipix AI</Text>
              </TouchableOpacity>
              </>
        ) : (
            selectedRecipe && (
              <AiItemView
                pic=''
                recipeTitle={selectedRecipe.title}
                recipeDescription={selectedRecipe.description}
                servedPeople={selectedRecipe.serves}
                recipeIngredients={selectedRecipe.ingredients}
                recipeInstructions={selectedRecipe.instructions}
                additionalNotes={selectedRecipe.additionalNotes}
                onBack={handleBack}
                onShare={handleShare}

              />
            )
        )
}

        </View>
  );
}

const styles = StyleSheet.create({
  recipeCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    overflow: "hidden",
  },
  recipeImage: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  recipeInfo: {
    padding: 15,
  },
  recipeTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
    marginBottom: 5,
  },
  recipeDescription: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  recipeServes: {
    fontSize: 14,
    color: "#ff9100",
    fontWeight: "600",
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff7e6",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  actionText: {
    fontSize: 14,
    color: "#ff9100",
    fontWeight: "600",
  },
    suggestBtn: {
    position: "absolute",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: "#ff9100",
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
});