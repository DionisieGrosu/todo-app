import { StyledText } from "@/utils/styles";
import React from "react";
import { Pressable, Text, View } from "react-native";

type Props = {
  children: React.ReactNode | "string";
  type?: "white" | "orange";
  color?: "red" | "green" | "white" | "orange";
  handler: any;
  buttonClassName?: string;
  textClassName?: string;
};
function CustomButton({
  children,
  type = "orange",
  color = "white",
  handler,
  buttonClassName = "",
  textClassName = "",
}: Props) {
  let colorClassName = "text-custom-orange";

  switch (color) {
    case "red": {
      colorClassName = "text-red-600";
      break;
    }
    case "green": {
      colorClassName = "text-green-400";
      break;
    }
    case "white": {
      colorClassName = "text-white";
      break;
    }
    default: {
      colorClassName = "text-custom-orange";
    }
  }
  return (
    <Pressable
      onPress={handler}
      style={{ width: "100%" }}
      className={`flex justify-center w-[100%]  rounded-[12px] p-[16px] text-center active:bg-custom-orange/[0.6] transition-all duration-500 ${buttonClassName} ${
        type == "orange" ? "bg-custom-orange" : "bg-white"
      }`}
    >
      <Text
        className={`w-[100%] text-center uppercase text-white font-mmedium text-[14px] ${textClassName} ${colorClassName}`}
      >
        {children}
      </Text>
    </Pressable>
  );
}

export default CustomButton;
