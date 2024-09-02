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
import { Link, Redirect, router } from "expo-router";
import { Toast } from "react-native-toast-notifications";
import { signIn, signUp } from "@/utils/firebaseRequests";
import { type } from "../utils/types";
import auth from "@react-native-firebase/auth";
import Loader from "@/components/Loader";
import { z } from "zod";
export default function Index() {
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [fullNameError, setFullNameError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const user = auth().currentUser;

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFullName("");
    setFullNameError(false);
    setEmailError(false);
    setPasswordError(false);
    setConfirmPasswordError(false);
  }, [isSignup]);

  const SignIn = z.object({
    email: z
      .string()
      .min(3, "Email must contain at least 3 characters")
      .email("Email is invalid"),
    password: z
      .string()
      .min(8, "The password must be at least 8 characters long")
      .max(32, "The password must be a maximun 32 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&*-\.])[A-Za-z\d!@#$%&*-\.]{8,}$/,
        "The Password is invalid"
      ),
  });

  const SignUp = z
    .object({
      fullName: z
        .string()
        .min(3, "Full Name must contain at least 3 characters"),
      email: z
        .string()
        .min(3, "Email must contain at least 3 characters")
        .email("Email is invalid"),
      password: z
        .string()
        .min(8, "The password must be at least 8 characters long")
        .max(32, "The password must be a maximun 32 characters")
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&*-\.])[A-Za-z\d!@#$%&*-\.]{8,}$/,
          "The Password is invalid"
        ),
      confirmPassword: z
        .string()
        .min(8, "The password must be at least 8 characters long")
        .max(32, "The password must be a maximun 32 characters")
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&*-\.])[A-Za-z\d!@#$%&*-\.]{8,}$/,
          "The Confirm Password is invalid"
        ),
      isVerified: z.boolean().optional(),
    })
    .superRefine(({ confirmPassword, password }, ctx) => {
      if (confirmPassword !== password) {
        ctx.addIssue({
          code: "custom",
          message: "The passwords did not match",
          path: ["confirmPassword"],
        });
      }
    });

  type SignIn = z.infer<typeof SignIn>;
  type SignUp = z.infer<typeof SignUp>;
  function signUpHandler() {
    setFullNameError(false);
    setEmailError(false);
    setPasswordError(false);
    setConfirmPasswordError(false);
    let validate = SignUp.safeParse({
      fullName,
      email,
      password,
      confirmPassword,
    });
    let errors = false;
    console.log("SIGNUP VALIDATION");
    console.log(SignUp);
    if (!validate.success) {
      errors = true;
      if (validate.error?.formErrors) {
        if (validate.error?.formErrors.fieldErrors.fullName) {
          setFullNameError(true);
        }
        if (validate.error?.formErrors.fieldErrors.email) {
          setEmailError(true);
        }
        if (validate.error?.formErrors.fieldErrors.password) {
          setPasswordError(true);
        }
        if (validate.error?.formErrors.fieldErrors.confirmPassword) {
          setConfirmPasswordError(true);
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
      signUp({ fullName, email, password, confirmPassword })
        .then((result) => {
          Toast.show(result.message, {
            type: "success",
          });
        })
        .catch((error) => {
          setLoading(false);
          setFullNameError(true);
          setEmailError(true);
          setPasswordError(true);
          setConfirmPasswordError(true);
          if (error.message) {
            Toast.show(error.message, {
              type: "danger",
            });
          } else {
            Toast.show("Something went wrong while trying to sign in", {
              type: "danger",
            });
          }
        });
    }
  }

  function signInHandler() {
    setEmailError(false);
    setPasswordError(false);
    let validate = SignIn.safeParse({ email, password });
    let errors = false;

    if (!validate.success) {
      errors = true;
      if (validate.error?.formErrors) {
        if (validate.error?.formErrors.fieldErrors.email) {
          setEmailError(true);
        }
        if (validate.error?.formErrors.fieldErrors.password) {
          setPasswordError(true);
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
      signIn({ email, password })
        .then((result) => {
          Toast.show(result.message, {
            type: "success",
          });
        })
        .catch((error) => {
          setLoading(false);
          setEmailError(true);
          setPasswordError(true);
          if (error.message) {
            Toast.show(error.message, {
              type: "danger",
            });
          } else {
            Toast.show("Something went wrong while trying to sign in", {
              type: "danger",
            });
          }
        });
    }
  }

  if (loading) {
    return <Loader />;
  } else {
    return (
      <>
        <SafeAreaView style={{ flex: 1, flexGrow: 1 }}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View className="flex-1 bg-white flex-col py-[46px]">
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
                  {!isSignup ? (
                    <>
                      <CustomInput
                        value={email}
                        label="Email"
                        type="email"
                        error={emailError}
                        onInputHandler={setEmail}
                      />
                      <CustomInput
                        value={password}
                        label="Password"
                        type="password"
                        error={passwordError}
                        onInputHandler={setPassword}
                      />
                    </>
                  ) : (
                    <>
                      <CustomInput
                        value={fullName}
                        label="Full Name"
                        error={fullNameError}
                        onInputHandler={setFullName}
                      />
                      <CustomInput
                        value={email}
                        label="Email"
                        type="email"
                        error={emailError}
                        onInputHandler={setEmail}
                      />

                      <CustomInput
                        value={password}
                        label="Password"
                        type="password"
                        error={passwordError}
                        onInputHandler={setPassword}
                      />
                      <CustomInput
                        value={confirmPassword}
                        label="Confirm Password"
                        type="password"
                        error={confirmPasswordError}
                        onInputHandler={setConfirmPassword}
                      />
                    </>
                  )}
                </KeyboardAvoidingView>
                {!isSignup && (
                  <View className="mb-[16px]">
                    <Link
                      className="text-right text-[#949494] text-[12px] font-mregular"
                      href="/forgotPassword"
                    >
                      Forgot Password?
                    </Link>
                  </View>
                )}

                {isSignup ? (
                  <CustomButton
                    buttonClassName="mb-[16px]"
                    handler={() => signUpHandler()}
                  >
                    Sign Up
                  </CustomButton>
                ) : (
                  <CustomButton
                    buttonClassName="mb-[16px]"
                    handler={() => signInHandler()}
                  >
                    Sign In
                  </CustomButton>
                )}
                {isSignup ? (
                  <Text className="text-[#272727] font-mregular text-[12px] text-center">
                    Already have an account?{" "}
                    <Text
                      onPress={() => setIsSignup(false)}
                      className="text-[#F79E89] font-mregular text-[12px]"
                    >
                      Sign in
                    </Text>
                  </Text>
                ) : (
                  <Text className="text-[#272727] font-mregular text-[12px] text-center">
                    Don`t have an account?{" "}
                    <Text
                      onPress={() => setIsSignup(true)}
                      className="text-[#F79E89] font-mregular text-[12px]"
                    >
                      Sign up
                    </Text>
                  </Text>
                )}
              </View>
            </View>
            <StatusBar translucent={true} backgroundColor="#fff" />
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
}
