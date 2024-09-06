import { Image } from "expo-image";
import React from "react";
import { Pressable, Text, View } from "react-native";

type Props = {
  title: string;
  text: string;
  date?: string;
  createdAt: string;
  onPress: () => void;
};
function TodoItem({ title, text, createdAt, date = "", onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className={`px-[16px] py-[8px] rounded-[12px] bg-custom-orange mb-[16px] ${
        date ? "bg-dark-orange" : "bg-custom-orange"
      }`}
    >
      {date && (
        <Image
          source={require("./../assets/images/clock-white.png")}
          className="absolute right-[10px] top-[10px] w-[13px] h-[13px]"
        />
      )}

      <Text className="font-msemibold text-[16px] text-white mb-[16px]">
        {title && title}
      </Text>
      <Text className="font-mregular text-[14px] text-white mb-[16px]">
        {text && text.length > 70 ? text.slice(0, 70) + " ..." : text}
      </Text>
      <Text className="font-mregular text-[11px] text-white">
        {createdAt && createdAt}
      </Text>
    </Pressable>
  );
}

export default TodoItem;
