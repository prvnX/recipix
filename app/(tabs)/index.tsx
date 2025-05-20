import { Platform, StyleSheet,View,ScrollView, Alert,ActivityIndicator } from 'react-native';
import { Text } from 'react-native-gesture-handler';
import Header from '@/components/header';
import InputField from '@/components/InputField';
import { TextInput } from "react-native-gesture-handler";
import RecipieCard from '@/components/RecipieCard';
import axios from 'axios';
import { useState,useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import React from 'react';
import { TouchableOpacity } from 'react-native';

type Meal = {
  id: string;
  name: string;
  area: string;
  category: string;
  image: string;
};


export default function HomeScreen() {
  const [searchText, setSearchText] = useState('');
  const [mealData, setMealData] =useState<Meal[]>([]); 
  const [isLoading, setIsLoading] = useState(false);
    useFocusEffect(
    useCallback(() => {
      const fetchMeals = async () => {
        setIsLoading(true);
        try {
          const requests = Array.from({ length: 10 }, () =>
            axios.get('https://www.themealdb.com/api/json/v1/1/random.php')
          );
          const responses = await Promise.all(requests);

          const meals: Meal[] = responses.map((response) => {
            const meal = response.data.meals[0];
            return {
              id: meal.idMeal,
              name: meal.strMeal,
              area: meal.strArea,
              category: meal.strCategory,
              image: meal.strMealThumb,
            };
          });
          const uniqueMeals = Array.from(new Map(meals.map(m => [m.id, m])).values());
          setMealData(uniqueMeals);
        } catch (error) {
          console.error(error);
          Alert.alert('Failed to fetch meals');
        } finally {
          setIsLoading(false);
        }
      };
      fetchMeals();
    }, [])
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
    <Header />
    <ScrollView>
    <InputField/>
 

    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 24, fontWeight: '700', marginTop: 16, marginLeft: 20,color: '#000000', fontFamily: '' }}>
        Handpicked recipes just for you!
      </Text>
      <View style={styles.cardContainer}>

      {
        isLoading ? (
          <ActivityIndicator size="large" color="#FF7043" />
        ) : (
          mealData.map((meal) => (
            <RecipieCard
              key={meal.id}
              id={meal.id}
              name={meal.name}
              Area={meal.area}
              category={meal.category}
              image={meal.image}
            />
          ))
        


        )
        
      
          // <Text key={mealData[0].id} style={{fontSize: 20, fontWeight: 'bold', margin : 10}}>{mealData[0].name}</Text>
          
          // <RecipieCard
          //   key={meal.id}r
          //   name={meal.name}
          //   Area={meal.area}
          //   category={meal.category}
          //   image={meal.image}
          // />
        
      }


        


      </View>
         
    </View>
    </ScrollView>
    </View>
  )
  
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  cardContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    marginBottom: 20,
    padding: 20
  },
});
