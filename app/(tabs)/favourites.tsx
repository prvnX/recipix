import { Platform, StyleSheet, View, ScrollView, Alert, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import Header from '@/components/header';
import InputField from '@/components/InputField';
import RecipieCard from '@/components/RecipieCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useCallback, use } from 'react';
import { useFocusEffect } from 'expo-router';
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';

type Meal = {
  id: string;
  name: string;
  area: string;
  category: string;
  image: string;
};

export default function Favourites() {
  const [mealData, setMealData] = useState<Meal[]>([]); 
  const [isLoading, setIsLoading] = useState(false);
  const {user}=useAuth();

  useFocusEffect(
    useCallback(() => {
      const fetchMeals = async () => {
        setIsLoading(true);
        try {
          const requests = await AsyncStorage.getItem(`favourites_${user?.email}`);
          const responses = requests ? JSON.parse(requests) : [];
          // const meals = responses.map((response) => {
            // Process each element if needed
          const meals: Meal[] = responses.map((meal: any) => ({
            id: meal.idMeal || meal.id,
            name: meal.strMeal || meal.name,
            area: meal.strArea || meal.area,
            category: meal.strCategory || meal.category,
            image: meal.strMealThumb || meal.image,
          }));

          const uniqueMeals = Array.from(new Map(meals.map(m => [m.id, m])).values());
          setMealData(uniqueMeals.reverse());
        } catch (error) {
          console.error(error);
          Alert.alert('Failed to fetch meals');
        } finally {
          setIsLoading(false);
        }
      };
      fetchMeals();
    }, [user])
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <Header />
      <ScrollView> 
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>
            Cook your favourites today!
          </Text>
          <InputField setMealData={setMealData} setTitleText={() => {}}/>
          <View style={styles.cardContainer}>
            {isLoading ? (
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
            )}

            {
              mealData.length==0 && 
                      <View style={{justifyContent:'center',marginVertical:50,flex:1,}}>

          <Ionicons name="heart-outline" size={100} color={'#626262'} style={{alignSelf:'center'}} />
          <Text style={{ textAlign: "center", marginTop: 50, fontSize: 20, color: "#626262" }}>
            You have no favourites recipes yet.
          </Text>
          
          
          </View>
            }
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 16,
    marginLeft: 20,
    color: '#000000',
  },
  cardContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    marginBottom: 20,
    padding: 20,
  },
});