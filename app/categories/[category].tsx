import React from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { View, Text,ScrollView } from "react-native";
import Header from '@/components/header';
import { useEffect,useState } from "react";
import { useLocalSearchParams } from "expo-router";
import RecipieCard from "@/components/RecipieCard";
import InputField from "@/components/InputField";
import { ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Alert } from "react-native";
import { useRouter } from "expo-router";


export default function CategoryPage() {
    const router = useRouter();
    const [imageUrl, setImageUrl] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
      const { category } = useLocalSearchParams();
      useEffect(() => {
            setIsLoading(true);
            fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`).then(res => res.json())
             .then(data => {
               const categoryData = data.categories.find((cat: any) => cat.strCategory.toLowerCase() === (category as string).toLowerCase());
                if(categoryData){
                    setImageUrl(categoryData.strCategoryThumb);
                    setDescription(categoryData.strCategoryDescription);
                }
             fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`).then(res => res.json())
             .then(data => {
               setData(data.meals);
                setIsLoading(false);
             })
             .catch(console.error);
        }).catch(console.error);
    }, [category]);
  const [data, setData] = useState<any[]>([]);

    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            {isLoading ?
            <ActivityIndicator size="large" color="#FF7043" style={{ margin: 'auto' }} /> : null}
            {!isLoading &&
            <>
        <ImageBackground source={{ uri: imageUrl }} resizeMode="cover" style={[styles.header, { backgroundColor: '#e1e1e1ff' }]}>
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
                </View>
                <View style={styles.headerText}>
                  <Text style={[styles.textHead, { fontSize: 40 }]}>{category}</Text>
                  
                </View>

              </LinearGradient>
            </View>
          </ImageBackground>


            <ScrollView style={{ flex: 1, padding: 10 }}>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {data ? data.map((meal: any) => (
                <RecipieCard 
                    key={meal.idMeal}
                    id={meal.idMeal}
                    name={meal.strMeal}
                    image={meal.strMealThumb}
                    category={category as string}
                />
            )) : <Text style={{ margin: "auto" }}>Loading...</Text>}
            </View>
         
        </ScrollView>
        </>
        }
        </View>
    );
    
}
const styles = StyleSheet.create({
header: {
    height: 150,
    width: '100%',
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
    textAlign: 'center',
    marginTop: 'auto',
    margin: 'auto'
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
  }
});
