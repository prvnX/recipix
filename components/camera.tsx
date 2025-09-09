import {
  CameraMode,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { useRef, useState } from "react";
import { Button, Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Ionicons } from "@expo/vector-icons";

type CameraProps = {
  onPictureTaken: (uri: string) => void;
  onClose: () => void;
};

export default function Camera({ onPictureTaken, onClose }: CameraProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);
  const [mode, setMode] = useState<CameraMode>("picture");
  const [facing, setFacing] = useState<CameraType>("back");
 
  if (!permission) {
    return null;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to use the camera
        </Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  const takePicture = async () => {
    const photo = await ref.current?.takePictureAsync();
    if (photo?.uri) {
      onPictureTaken(photo.uri);
    }
    onClose();

  };



  const toggleMode = () => {
    setMode((prev) => (prev === "picture" ? "video" : "picture"));
  };

  const toggleFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };


  const renderCamera = () => {
    return (
      <CameraView
        style={styles.camera}
        ref={ref}
        mode={mode}
        facing={facing}
        mute={false}
        responsiveOrientationWhenOrientationLocked
      >
        <View style={styles.overlay}>
          <View style={styles.scannerFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
          <View style={styles.shutterContainer}>

            <Pressable onPress={takePicture}>
              {({ pressed }) => (
                <View
                  style={[
                    styles.shutterBtn,
                    {
                      opacity: pressed ? 0.6 : 1,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.shutterBtnInner,
                      {
                        backgroundColor: mode === "picture" ? "transparent" : "red",
                      },
                    ]}
                  >
                    <Ionicons name="sparkles" size={30} color={mode === "picture" ? "#ff9100" : "#ff9100"} style={{ alignSelf: 'center' }} />
                  </View>
                </View>
              )}
            </Pressable>

          </View>
        </View>
      </CameraView>
    );
  };

  return (
    <View style={styles.container}>
      {renderCamera()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  topBar: {
    paddingTop: 44,
    paddingHorizontal: 20,
    height: 90,
    backgroundColor: 'rgba(0,0,0,0.5)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeBtn: {
    padding: 6,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  scannerFrame: {
    alignSelf: 'center',
    marginTop: 50,
    width: 350,
    height: 350,
    borderRadius: 20,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#ff9100',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 20,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 20,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 20,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 20,
  },
  shutterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#0000005e',
    paddingHorizontal: 40,
  },
  shutterBtn: {
    width: 60,
    height: 60,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ff9100',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  shutterBtnInner: {
    width: 70,
    height: 70,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  iconBtn: {
    padding: 10,
  },
});