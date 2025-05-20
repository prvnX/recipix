import { Stack, useLocalSearchParams } from 'expo-router';
import { View, Text, ScrollView, Image } from 'react-native';
import { useEffect, useState } from 'react';

export default function RecipeDetails() {
  const { id } = useLocalSearchParams();
  const [recipe, setRecipe] = useState<any>(null);

  useEffect(() => {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
      .then((res) => res.json())
      .then((data) => setRecipe(data.meals[0]))
      .catch(console.error);
  }, [id]);

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <Stack.Screen
        options={{
          title: recipe?.strMeal || 'Recipe Details',  // Dynamic title
          headerStyle: {
            backgroundColor: '#FF7043',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />

      <ScrollView style={{ padding: 20 }}>
        {recipe && (
          <>
            <Image source={{ uri: recipe.strMealThumb }} style={{ height: 200, borderRadius: 10 }} />
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 20 }}>{recipe.strMeal}</Text>
            <Text style={{ color: '#666', marginVertical: 10 }}>{recipe.strCategory} - {recipe.strArea}</Text>
            <Text>{recipe.strInstructions}</Text>
          </>
        )}
      </ScrollView>
    </View>
  );
}