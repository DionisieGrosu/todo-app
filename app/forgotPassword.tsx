import { useEffect, useState } from "react";
import { StyledImage, StyledText } from "@/utils/styles";

import {
  SafeAreaInsetsContext,
  SafeAreaView,
} from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Image } from "expo-image";
import CustomInput from "@/components/CustomInput";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import { z } from "zod";
import { Toast } from "react-native-toast-notifications";
import { resetPassword } from "../utils/firebaseRequests";
export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);

  const Email = z.object({
    email: z
      .string()
      .min(3, "Email must contain at least 3 characters")
      .email("Email is invalid"),
  });

  type Email = z.infer<typeof Email>;
  function resetPasswordHandler() {
    setEmailError(false);
    let validate = Email.safeParse({
      email,
    });
    let errors = false;
    if (!validate.success) {
      errors = true;
      if (validate.error?.formErrors) {
        if (validate.error?.formErrors.fieldErrors.email) {
          setEmailError(true);
        }
      }
      if (validate.error.issues[0]) {
        if (validate.error.issues[0]?.message) {
          Toast.show(validate.error.issues[0]?.message, {
            type: "danger",
          });
        }
      }
    }

    if (!errors) {
      setLoading(true);
      resetPassword({ email })
        .then((result) => {
          Toast.show(result.message, {
            type: "success",
          });
          router.replace("/");
        })
        .catch((error) => {
          setLoading(false);
          setEmailError(true);
          if (error.message) {
            Toast.show(error.message, {
              type: "danger",
            });
          } else {
            Toast.show("Something went wrong while trying to reset password", {
              type: "danger",
            });
          }
        });
    }
  }
  return (
    <>
      <SafeAreaView style={{ flex: 1, flexGrow: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 bg-white flex-col py-[46px]">
            <Link
              className="absolute left-2 top-2 h-[24px] w-[24px]"
              replace
              href={"/"}
            >
              <Image
                source={require("./../assets/images/chevron-left.png")}
                className="h-[24px] w-[24px]"
              />
            </Link>
            <View className="flex justify-center items-center mt-[15vh] pb-[10vh]">
              <Image
                className="w-[187px] h-[187px] max-w-[187px] max-h-[187px]"
                contentFit="contain"
                source={require("./../assets/images/logo.png")}
              />
            </View>
            <View className="flex-1 px-[24px] flex-col justify-end">
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
              >
                <>
                  <CustomInput
                    value={email}
                    label="Email"
                    error={emailError}
                    onInputHandler={setEmail}
                  />
                </>
              </KeyboardAvoidingView>

              <CustomButton
                buttonClassName="mb-[16px]"
                handler={() => resetPasswordHandler()}
              >
                Send
              </CustomButton>
            </View>
          </View>
          <StatusBar translucent={true} backgroundColor="#fff" />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
