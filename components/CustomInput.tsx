import { StyledInput, StyledOcticons } from "@/utils/styles";
import Octicons from "@expo/vector-icons/Octicons";
import React, { useState } from "react";
import { Pressable, TextInput, View } from "react-native";

type Props = {
  label: string;
  value?: string | number;
  type?: "password" | "text" | "email";
  onInputHandler: any;
  error?: boolean;
};
function CustomInput({
  label,
  value = "",
  type = "text",
  onInputHandler,
  error = false,
}: Props) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View
      className={`flex w-full px-[16px] flex-row justify-between py-[10px] rounded-[12px] border-[1px] ${
        error ? "border-red-500" : "border-[#272727]"
      }`}
      style={{ marginBottom: 16 }}
    >
      <TextInput
        value={value.toString()}
        autoCapitalize={type == "email" ? "none" : "sentences"}
        autoComplete={type == "email" ? "email" : "off"}
        secureTextEntry={type == "password" && !showPassword}
        placeholder={label}
        style={[
          {
            fontFamily: "Montserrat-Regular",
            maxWidth: "90%",
            width: "90%",
          },
          type == "password"
            ? { maxWidth: "90%", width: "90%" }
            : { maxWidth: "100%", width: "100%" },
        ]}
        className={`text-[16px]`}
        placeholderTextColor={"#949494"}
        onChangeText={(text) => onInputHandler(text)}
      />
      {type == "password" && (
        <Pressable onPress={() => setShowPassword(!showPassword)}>
          <Octicons
            name={!showPassword ? "eye-closed" : "eye"}
            size={24}
            color="#949494"
          />
        </Pressable>
      )}
    </View>
  );
}

export default CustomInput;
