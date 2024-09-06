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
  styleType?: "normal" | "white";
  textarea?: boolean;
  inputClasses?: string;
};
function CustomInput({
  label,
  value = "",
  type = "text",
  onInputHandler,
  error = false,
  styleType = "normal",
  textarea = false,
  inputClasses = "",
}: Props) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View
      className={`flex items-start w-full px-[16px] flex-row justify-between py-[10px] rounded-[12px] border-[1px] ${inputClasses} ${
        error
          ? "border-red-500"
          : styleType == "normal"
          ? "border-[#272727]"
          : "border-white"
      }`}
      style={{ marginBottom: 16 }}
    >
      <TextInput
        value={value.toString()}
        autoCapitalize={type == "email" ? "none" : "sentences"}
        autoComplete={type == "email" ? "email" : "off"}
        secureTextEntry={type == "password" && !showPassword}
        placeholder={label}
        multiline={textarea ? true : false}
        textAlignVertical={textarea ? "top" : "center"}
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
        className={`h-[100%] text-[16px] ${
          styleType == "normal" ? "text-[#272727]" : "text-[#ffffff]"
        }`}
        placeholderTextColor={styleType == "normal" ? "#949494" : "#ffffff"}
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
