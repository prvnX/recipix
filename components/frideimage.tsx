import React, { useState } from "react";
import { Image } from "react-native";

const FridgeImage = ({ uri, style }: { uri: string; style: any }) => {
  const [loadError, setLoadError] = useState(false);

  return (
    <Image
      source={loadError || !uri ? require("@/assets/images/default-ing.png") : { uri }}
      style={style}
      onError={() => setLoadError(true)}
    />
  );
};

export default FridgeImage;