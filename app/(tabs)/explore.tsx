import { Platform, StyleSheet, View, ScrollView, Text,Image, TouchableOpacity, Alert } from 'react-native';
import Header from '@/components/header';
import CategorySearch from '@/components/categorySearch';
import { useEffect,useState} from 'react';
import { Router, useRouter } from 'expo-router';

export default function categories() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
    .then(res => res.json())
    .then(data => {
      setCategories(data.categories);
    })
    .catch(console.error);
  }, []);
  function changeCategory(newCategory: string) {
    if(newCategory == ''){
      fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
      .then(res => res.json())
      .then(data => {
        setCategories(data.categories);
      })
      .catch(console.error);
      return;
    }
    const filteredCategories = categories.filter((category: any) => category.strCategory.toLowerCase().includes(newCategory.toLowerCase()));
    setCategories(filteredCategories);
  }
  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
        <Header />
        <ScrollView>
          <CategorySearch changeCategory={changeCategory} />
                  <Text style={{ fontSize: 24, fontWeight: '700', marginLeft: 20,color: '#000000', fontFamily: '' }} >
                    Discover by Category
                  </Text>
          <View style={styles.cardContainer}>
            {
              categories.map((category: any) => (
                <TouchableOpacity key={category.idCategory} style={styles.card} onPress={() => router.push(`/categories/${category.strCategory}`)}>
                  <Image source={{ uri: category.strCategoryThumb }} style={{ width: '100%', height: 150, borderRadius: 8 ,backgroundColor: '#f1f1f1'}} />

                  <Text style={{ fontSize: 18, fontWeight: '400', marginBottom: 5 , marginTop: 5,textAlign: 'center'}}>{category.strCategory}</Text>

                </TouchableOpacity>
              ))
            }
          </View>
        </ScrollView>
        </View>
  
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 20,
    marginBottom: 10,
  },
cardContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  padding: 10,
},

card: {
  width: '48%', // two items per row (with small spacing)
  marginBottom: 15,
  backgroundColor: '#fff',
  borderRadius: 8,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 2,
  padding: 10,
}
  
});
