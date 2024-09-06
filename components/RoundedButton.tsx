import React from "react";
import { Pressable } from "react-native";

type Props = {
  children: React.ReactNode | string;
  handler: () => void;
  classes?: string;
};
function RoundedButton({ children, handler, classes = "" }: Props) {
  return (
    <Pressable
      className={`flex items-center justify-center w-[60px] h-[60px] rounded-full bg-[#F76C6A] ${classes}`}
      onPress={handler}
    >
      {children}
    </Pressable>
  );
}

export default RoundedButton;
