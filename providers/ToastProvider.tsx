import React from "react";
import { Text, View } from "react-native";
import { ToastProvider } from "react-native-toast-notifications";

// "normal" | "success" | "danger" | "warning";

type Props = {
  children: React.ReactNode;
};
export default ({ children }: Props) => {
  return (
    <ToastProvider
      renderToast={(toastOptions) => {
        switch (toastOptions.type) {
          case "success":
            return (
              <View className={`w-[90%] bg-[#07bc0c] p-3 rounded-md`}>
                <Text className="text-center text-white text-[15px]">
                  {toastOptions.message}
                </Text>
              </View>
            );
            break;
          case "normal":
            return (
              <View className={`w-[90%] bg-[#3498db] p-3 rounded-md`}>
                <Text className="text-center text-white text-[15px]">
                  {toastOptions.message}
                </Text>
              </View>
            );
            break;
          case "warning":
            return (
              <View className={`w-[90%] bg-[#f1c40f] p-3 rounded-md`}>
                <Text className="text-center text-white text-[15px]">
                  {toastOptions.message}
                </Text>
              </View>
            );
            break;
          default:
            return (
              <View className={`w-[90%] bg-[#e74c3c] p-3 rounded-md`}>
                <Text className="text-center text-white text-[15px]">
                  {toastOptions.message}
                </Text>
              </View>
            );
        }
      }}
    >
      {children}
    </ToastProvider>
  );
};
