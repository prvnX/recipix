import { Stack, useLocalSearchParams } from 'expo-router';
import { View, Text, ScrollView, ImageBackground, SafeAreaView, StyleSheet, StatusBar, TouchableOpacity, Alert , Linking} from 'react-native';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import IngredientImg from '@/components/ingrediantimg';
import YouTubePlayer from '@/components/Video';
import AsyncStorage from '@react-native-async-storage/async-storage';

const router = useRouter();

export default function RecipeDetails() {
  const { id } = useLocalSearchParams();
  const [recipe, setRecipe] = useState<any>(null);
  const [favourite, setFavourite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [titleSize, setTitleSize] = useState(40);
  const [activeTab, setActiveTab] = useState('ingredients');

  const saveData = async () => {
  try {
    const saveData = recipe;
    const userID = '123'; // Replace with a userID
    const itemKey= saveData.idMeal;
    const key= `${userID}_${itemKey}`;
    await AsyncStorage.setItem(key, JSON.stringify(saveData));
    setFavourite(true);
  } catch (e) {
    console.error('Failed to save data:', e);
  }
};
async function checkFavourite(id: string) {
  const userID = '123'; // Replace with a userID
  const data = await AsyncStorage.getItem(`${userID}_${id}`);
  if (data !== null) {
    setFavourite(true);
  }

}

  useEffect(() => {
    setIsLoading(true);
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setRecipe(data.meals[0]);
        const length = data.meals[0].strMeal.length;
        if (length >= 30) setTitleSize(20);
        else if (length > 25) setTitleSize(25);
        else if (length > 22) setTitleSize(25);
        else if (length > 20) setTitleSize(30);
        else setTitleSize(40);
        setIsLoading(false);
        checkFavourite(data.meals[0].idMeal);

      })
      .catch(console.error);
  }, [id]);

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <StatusBar hidden={true} />
      <Stack.Screen
        options={{
          title: recipe?.strMeal || 'Recipe Details',
          headerStyle: { backgroundColor: '#FF7043' },
          headerShown: false,
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
      {recipe && (
        <>
          <ImageBackground source={{ uri: recipe.strMealThumb }} resizeMode="cover" style={styles.header}>
            <View style={styles.headerInside}>
              <LinearGradient
                colors={['#00000000', '#000']}
                style={styles.container}
                start={{ x: 0.5, y: 0.6 }}
                end={{ x: 0.5, y: 1 }}
              >
                <View style={styles.headerTopRow}>
                  <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.icon}><Ionicons name="arrow-back" size={20} color="black" /></Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => { !favourite ? saveData() : Alert.alert('Already Added to Favourites') }}>
                    {
                      favourite ? (
                        <Text style={styles.icon}><Ionicons name="heart" size={20} color="#FF7043" /></Text>
                      ) : (
                        <Text style={styles.icon}><Ionicons name="heart-outline" size={20} color="#FF7043" /></Text>
                      )
                    }
                  </TouchableOpacity>
                </View>
                <View style={styles.headerText}>
                  <Text style={[styles.textHead, { fontSize: titleSize }]}>{recipe.strMeal}</Text>
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <Text style={styles.category}>{recipe.strCategory}</Text>
                    <Text style={styles.category}>{recipe.strArea}</Text>
                  </View>
                </View>
              </LinearGradient>
            </View>
          </ImageBackground>

          <View style={{ flex: 1 }}>
            <ScrollView
              style={{ padding: 10 }}
              contentContainerStyle={{ paddingBottom: 50 }}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.toolBar}>
                {['ingredients', 'instructions', 'resources'].map(tab => (
                  <TouchableOpacity
                    key={tab}
                    style={[styles.button, activeTab === tab && { backgroundColor: '#fff' }]}
                    onPress={() => setActiveTab(tab)}
                  >
                    <Text style={[styles.buttonText, activeTab === tab && { color: '#FF7043' }]}>
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {activeTab === 'ingredients' ? (
                <Text style={styles.recipie}>
                  <View style={styles.ingContainer}>
                  {Array.from({ length: 20 }, (_, i) => {
                    const ing = recipe[`strIngredient${i + 1}`];
                    const measure = recipe[`strMeasure${i + 1}`];
                    return ing ? (
                      <View key={i} style={styles.ing}>
                        <IngredientImg image={ing} />
                        
                        <Text style={styles.ingTitle}>{ing} </Text>
                        <Text style={styles.messure}>{measure}</Text>
                      </View>
                    ) : null;
                  })}
                  </View>
                </Text>
              ) : activeTab === 'resources' ? (
                recipe.strYoutube ? (
                  <>
                <View style={styles.recipie}>
                  
                  <YouTubePlayer youtubeUrl={recipe.strYoutube} />
                      <TouchableOpacity onPress={() => { Linking.openURL(recipe.strSource) }}>
                      <Text style={styles.seeMore}>
                        See More on Website                      
                      </Text>
                    </TouchableOpacity>
                  </View>

                </>
                
                ) : (
                  <Text style={styles.recipie}>No video available</Text>
                )
              ) : (
                <Text style={styles.recipie}>{recipe.strInstructions}</Text>
              )}
            </ScrollView>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 270,
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
    marginTop: 110,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
  },
  category: {
    fontSize: 12,
    color: '#000',
    fontWeight: 'bold',
    backgroundColor: '#ccc',
    padding: 7,
    paddingHorizontal: 10,
    borderRadius: 50,
    textAlign: 'center',
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
  toolBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ECEDEF',
    borderRadius: 5,
    padding: 3,
    gap: 5,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
  },
  buttonText: {
    textAlign: 'center',
    color: '#6B7280',
    fontWeight: '600',
  },
  recipie: {
    fontSize: 20,
    fontWeight: '500',
    marginTop: 10,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 5,
    
  },
  
  ing:{
    borderRadius: 10,
    display: 'flex',
    justifyContent:'center',
    alignItems:'center',
    padding: 10,

  },
  ingTitle:{
    fontSize: 20,
    fontWeight: 'bold',
  },
  messure:{
    fontSize: 15,
    color: '#4B5563',
  },
  ingContainer:{
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    justifyContent: 'space-between',
  },
  seeMore: {
    fontSize: 16,
    color: '#000',
    fontWeight: 500,
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
  
    borderColor: '#000',
    borderWidth: 0.5,
    textShadowColor: '#000',
  },
});
