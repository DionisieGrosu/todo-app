import React from "react";
import { View } from "react-native";
import LoaderKit from "react-native-loader-kit";

function Loader() {
  return (
    <View className="flex flex-1 bg-white items-center justify-center">
      <LoaderKit
        style={{ width: 100, height: 100 }}
        name={"BallScaleRippleMultiple"} // Optional: see list of animations below
        color={"#F79E89"} // Optional: color can be: 'red', 'green',... or '#ddd', '#ffffff',...
      />
    </View>
  );
}

export default Loader;
