import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ImageBackground, Pressable , StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

interface AiItemViewProps {
  pic?: string;
  recipeTitle: string;
  recipeDescription: string;
  servedPeople: number;
  recipeIngredients: string[];
  recipeInstructions: string[];
  additionalNotes: string;
  onBack: () => void;
  onShare: () => void;
}

const AiItemView: React.FC<AiItemViewProps> = ({
  pic = '',
  recipeTitle,
  recipeDescription,
  servedPeople,
  recipeIngredients,
  recipeInstructions,
  additionalNotes,
  onBack,
  onShare
}) => {
  const [activeTab, setActiveTab] = useState<'Ingredients' | 'Instructions' | 'Additional Notes'>('Ingredients');

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground source={pic ? { uri: pic } : require('@/assets/images/default.png')} style={styles.header}>
        <View style={styles.headerInside}>
          <LinearGradient
            colors={['#00000000', '#000']}
            style={styles.container}
            start={{ x: 0.5, y: 0.6 }}
            end={{ x: 0.5, y: 1 }}
          >
            <View style={styles.headerTopRow}>
              <TouchableOpacity onPress={onBack}>
                <Ionicons name="arrow-back" size={20} color="black" style={styles.icon} />
              </TouchableOpacity>
              <View style={{ flexDirection: 'row', gap: 10 }}>

                <TouchableOpacity onPress={onShare}>
                  <Ionicons name="share-outline" size={20} color="#000000ff" style={styles.icon} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.headerText}>
              <Text style={[styles.textHead, { fontSize: 20 }]}>{recipeTitle}</Text>
              <Text style={[styles.recipeText, { fontWeight: '300', fontSize: 12, color: 'white' }]}>{recipeDescription}</Text>
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
      <ScrollView style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}>
        <View style={{ paddingBottom: 50 }}>
          {activeTab === 'Ingredients' && (
            <>
              <Text style={{ alignSelf: 'center', marginBottom: 10, color: '#ff9100', fontSize: 16, fontWeight: '400' }}>
                Ingredients for <Text style={{ fontWeight: '700', fontSize: 20, color: '#ff9100ff' }}>{servedPeople}</Text> {servedPeople === 1 ? 'person' : 'people'}
              </Text>
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
              <Text style={[styles.recipeText, styles.item, { fontStyle: 'italic', color: '#ff8585ff', fontWeight: '800', borderColor: '#ff8585ff', borderWidth: 2, backgroundColor: '#fff4f4ff' }]}>
                This recipe is AI-generated. Please verify ingredients, steps, and cooking times before use, as AI can make mistakes.
              </Text>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { height: 200 },
  headerInside: { height: '100%' },
  container: { flex: 1, padding: 20 },
  headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 5 },
  icon: { backgroundColor: '#fff', padding: 7, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.8, shadowRadius: 2, elevation: 5 },
  headerText: { flexDirection: 'column', gap: 5, marginTop: 'auto' },
  textHead: { color: '#fff', fontWeight: 'bold', shadowColor: '#000', textShadowColor: '#000', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 1 },
  recipeText: { fontSize: 16, color: '#010101ff', lineHeight: 22, marginBottom: 5 },
  item: { fontSize: 16, marginBottom: 10, color: '#222', borderWidth: 0.5, borderColor: '#ff9100', padding: 10, borderRadius: 5, backgroundColor: '#fffcf5ff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 5 },
});

export default AiItemView;