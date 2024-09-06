import React from "react";
import { Pressable, Text, View } from "react-native";
import Octicons from "@expo/vector-icons/Octicons";
import moment from "moment";

type Props = {
  label: string;
  value?: string | number;
  clickHandler: any;
  error?: boolean;
  styleType?: "normal" | "white";
  inputClasses?: string;
};

function CustomDatePickerInput({
  label,
  value = "",
  clickHandler,
  error = false,
  styleType = "normal",
  inputClasses = "",
}: Props) {
  return (
    <Pressable
      onPress={clickHandler}
      className={`flex items-start w-full px-[16px] flex-row justify-between py-[10px] rounded-[12px] border-[1px] ${inputClasses} ${
        error
          ? "border-red-500"
          : styleType == "normal"
          ? "border-[#272727]"
          : "border-white"
      }`}
      style={{ marginBottom: 16 }}
    >
      <View className="flex flex-row justify-between w-[100%]">
        <Text
          className={`font-mregular text-[16px]  ${
            value ? "text-white" : "text-gray-200"
          }`}
        >
          {value ? moment(value).format("MMMM Do YYYY") : "Deadline (optional)"}
        </Text>
        <Octicons name="calendar" size={24} color="white" />
      </View>
    </Pressable>
  );
}

export default CustomDatePickerInput;
