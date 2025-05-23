import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';

type props = {
  youtubeUrl: string;
};

const YouTubePlayer = ({ youtubeUrl} : props ) => {
  const videoId = extractVideoId(youtubeUrl);
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: embedUrl }}
        style={styles.webview}
        
      />
    </View>
  );
};

// Extracts the video ID from various YouTube URL formats
const extractVideoId = (url:string) => {
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const styles = StyleSheet.create({
  container: {
    height: (Dimensions.get('window').width * 9) / 16,
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 0.3,
    padding:5
  },
  webview: {
    flex: 1,
  },
});

export default YouTubePlayer;