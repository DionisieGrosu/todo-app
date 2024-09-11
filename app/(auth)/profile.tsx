import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import auth from "@react-native-firebase/auth";
import Loader from "@/components/Loader";
import {
  editPassword,
  editProfile,
  getUserData,
} from "@/utils/firebaseRequests";
import { Toast } from "react-native-toast-notifications";
import CustomButton from "@/components/CustomButton";
import Modal from "react-native-modal";
import DropShadow from "react-native-drop-shadow";
import CustomInput from "@/components/CustomInput";
import MenuPopup from "@/components/MenuPopup";
import { z } from "zod";
import LogoutModal from "@/components/LogoutModal";

function Profile() {
  const [loading, setLoading] = useState<boolean>(true);
  const windowWidth = Dimensions.get("window").width;
  const [userData, setUserData] = useState({});
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [fullNameError, setFullNameError] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [newPasswordError, setNewPasswordError] = useState<boolean>(false);
  const [confirmPasswordError, setConfirmPasswordError] =
    useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showPasswordEditModal, setShoPasswordEditModal] =
    useState<boolean>(false);

  const [editProfileLoading, setEditProfileLoading] = useState(false);
  const [editPasswordLoading, setEditPasswordLoading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const user = auth().currentUser;

  useEffect(() => {
    setFullNameError(false);
    setEmailError(false);
    setPasswordError(false);
    setNewPasswordError(false);
    setConfirmPasswordError(false);
  }, [showEditModal]);
  useEffect(() => {
    if (user) {
      setLoading(false);
      getUserData().then((result) => {
        if (result.success) {
          if (result.data.fullName) {
            setFullName(result.data.fullName);
          }

          if (result.data.email) {
            setEmail(result.data.email);
          }
        } else {
          Toast.show("Something went wrong while trying to get user info");
        }
      });
    }
  }, []);

  const EditProfile = z.object({
    fullName: z.string().min(3, "Full Name must contain at least 3 characters"),
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

  const EditPassword = z.object({
    newPassword: z
      .string()
      .min(8, "The old password must be at least 8 characters long")
      .max(32, "The old password must be a maximun 32 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&*-\.])[A-Za-z\d!@#$%&*-\.]{8,}$/,
        "The Old Password is invalid"
      ),
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
  });

  type EditProfile = z.infer<typeof EditProfile>;
  type EditPassword = z.infer<typeof EditPassword>;

  const editProfileHandler = () => {
    setFullNameError(false);
    setEmailError(false);
    setPasswordError(false);
    let validate = EditProfile.safeParse({
      fullName,
      email,
      password,
    });
    let errors = false;
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
      }
      if (validate.error.issues[0]) {
        if (validate.error.issues[0]?.message) {
          setShowEditModal(false);
          Toast.show(validate.error.issues[0]?.message, {
            type: "danger",
          });
        }
      }
    }

    if (!errors) {
      setEditProfileLoading(true);
      editProfile({ fullName, email, password })
        .then((result) => {
          setEditProfileLoading(false);
          setShowEditModal(false);
          if (result.success) {
            if (result.data.fullName) {
              setFullName(result.data.fullName);
            }
            if (result.data.email) {
              setEmail(result.data.email);
            }
            Toast.show("Profile updated successfuly!", {
              type: "success",
            });
          } else {
            Toast.show("Something went wrong while trying to edit profile", {
              type: "danger",
            });
          }
        })
        .catch((error) => {
          setEditProfileLoading(false);
          setShowEditModal(false);
          if (error.message) {
            Toast.show(error.message, {
              type: "danger",
            });
          } else {
            Toast.show("Something went wrong while trying to edit profile", {
              type: "danger",
            });
          }
        });
    }
  };

  const editPasswordHandler = () => {
    setFullNameError(false);
    setEmailError(false);
    setNewPasswordError(false);
    setPasswordError(false);
    setConfirmPasswordError(false);
    let validate = EditPassword.safeParse({
      newPassword,
      password,
      confirmPassword,
    });
    let errors = false;
    if (!validate.success) {
      errors = true;
      if (validate.error?.formErrors) {
        if (validate.error?.formErrors.fieldErrors.newPassword) {
          setNewPasswordError(true);
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
          setShoPasswordEditModal(false);
          Toast.show(validate.error.issues[0]?.message, {
            type: "danger",
          });
        }
      }
    }

    if (!errors) {
      setEditPasswordLoading(true);
      editPassword({ newPassword, password, confirmPassword })
        .then((result) => {
          setEditPasswordLoading(false);
          setShoPasswordEditModal(false);
          if (result.success) {
            Toast.show("Password updated successfuly!", {
              type: "success",
            });
          } else {
            Toast.show("Something went wrong while trying to edit password", {
              type: "danger",
            });
          }
        })
        .catch((error) => {
          setEditPasswordLoading(false);
          setShoPasswordEditModal(false);
          if (error.message) {
            Toast.show(error.message, {
              type: "danger",
            });
          } else {
            Toast.show("Something went wrong while trying to edit password", {
              type: "danger",
            });
          }
        });
    }
  };

  if (loading) {
    return <Loader />;
  } else {
    return (
      <SafeAreaView style={{ flex: 1, flexGrow: 1 }}>
        <View className="flex-1 bg-white px-[24px]">
          <View className="flex flex-row justify-between items-center py-[12px]">
            <Pressable onPress={() => router.back()}>
              <Image
                source={require("./../../assets/images/chevron-left.png")}
                className="w-[24px] h-[24px]"
              />
            </Pressable>
            <View>
              <MenuPopup
                data={[
                  {
                    text: "Edit Profile",
                    handler: () => setShowEditModal(true),
                  },
                ]}
                icon={
                  <Image
                    source={require("./../../assets/images/settings.png")}
                    className="w-[24px] h-[24px]"
                  />
                }
              />
            </View>
          </View>
          <View className="flex flex-1">
            <View className="flex-1 justify-center items-center">
              <Image
                source={require("./../../assets/images/Profile.png")}
                style={{
                  width: windowWidth - 48,
                  height: windowWidth - 48 - 83,
                }}
              />
            </View>
            <View className="flex-1 justify-center">
              <View className="flex gap-[16px]">
                <View className="flex flex-row justify-between">
                  <Text className="font-mregular text-[16px] text-[#272727]">
                    Full Name
                  </Text>
                  <Text className="font-mregular text-[16px] text-[#F79E89]">
                    {fullName}
                  </Text>
                </View>
                <View className="flex flex-row justify-between">
                  <Text className="font-mregular text-[16px] text-[#272727]">
                    Email
                  </Text>
                  <Text className="font-mregular text-[16px] text-[#F79E89]">
                    {email}
                  </Text>
                </View>
                <View className="flex flex-row justify-between">
                  <Text className="font-mregular text-[16px] text-[#272727]">
                    Password
                  </Text>
                  <Pressable onPress={() => setShoPasswordEditModal(true)}>
                    <Text className="font-msemibold text-[16px] text-[#F79E89]">
                      Change Password
                    </Text>
                  </Pressable>
                </View>
              </View>
              <View>
                <CustomButton
                  buttonClassName="mt-[40px]"
                  handler={() => setShowLogoutModal(true)}
                >
                  Log out
                </CustomButton>
              </View>
            </View>
          </View>
          <View>
            <Modal
              onSwipeComplete={() => setShowEditModal(false)}
              animationIn={"slideInUp"}
              backdropColor="transparent"
              className="flex px-[24px] m-0 p-0"
              isVisible={showEditModal}
              swipeDirection="down"
              useNativeDriver={false}
              onBackdropPress={() => setShowEditModal(false)}
            >
              <View className="flex-1"></View>
              <View className="">
                <DropShadow
                  className=""
                  style={{
                    shadowColor: "#F79E89",
                    shadowOffset: {
                      width: 0,
                      height: -10,
                    },
                    shadowOpacity: 0.3,
                    shadowRadius: 20,
                  }}
                >
                  <View className="flex bg-white rounded-t-[24px]">
                    <View className="px-[24px] flex-col justify-end  pb-[50px]">
                      <Text className="text-center font-msemibold text-custom-orange text-[25px] mb-[50px] mt-[20px] uppercase">
                        Edit Profile
                      </Text>
                      {editProfileLoading && <Loader />}
                      {!editProfileLoading && (
                        <>
                          <KeyboardAvoidingView
                            behavior={
                              Platform.OS === "ios" ? "padding" : "height"
                            }
                          >
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
                          </KeyboardAvoidingView>

                          <CustomButton
                            buttonClassName="mb-[16px]"
                            handler={() => editProfileHandler()}
                          >
                            Save
                          </CustomButton>
                        </>
                      )}
                    </View>
                  </View>
                </DropShadow>
              </View>
            </Modal>
          </View>

          <View>
            <Modal
              onSwipeComplete={() => setShoPasswordEditModal(false)}
              animationIn={"slideInUp"}
              backdropColor="transparent"
              className="flex px-[24px] m-0 p-0"
              isVisible={showPasswordEditModal}
              swipeDirection="down"
              useNativeDriver={false}
              onBackdropPress={() => setShoPasswordEditModal(false)}
            >
              <View className="flex-1"></View>
              <View className="">
                <DropShadow
                  className=""
                  style={{
                    shadowColor: "#F79E89",
                    shadowOffset: {
                      width: 0,
                      height: -10,
                    },
                    shadowOpacity: 0.3,
                    shadowRadius: 20,
                  }}
                >
                  <View className="flex bg-white rounded-t-[24px]">
                    <View className="px-[24px] flex-col justify-end  pb-[50px]">
                      <Text className="text-center font-msemibold text-custom-orange text-[25px] mb-[50px] mt-[20px] uppercase">
                        Edit Password
                      </Text>
                      {editPasswordLoading && <Loader />}
                      {!editPasswordLoading && (
                        <>
                          <KeyboardAvoidingView
                            behavior={
                              Platform.OS === "ios" ? "padding" : "height"
                            }
                          >
                            <CustomInput
                              value={password}
                              label="Password"
                              type="password"
                              error={passwordError}
                              onInputHandler={setPassword}
                            />
                            <CustomInput
                              value={newPassword}
                              label="New Password"
                              type="password"
                              error={newPasswordError}
                              onInputHandler={setNewPassword}
                            />
                            <CustomInput
                              value={confirmPassword}
                              label="Confirm Password"
                              type="password"
                              error={confirmPasswordError}
                              onInputHandler={setConfirmPassword}
                            />
                          </KeyboardAvoidingView>

                          <CustomButton
                            buttonClassName="mb-[16px]"
                            handler={() => editPasswordHandler()}
                          >
                            Save
                          </CustomButton>
                        </>
                      )}
                    </View>
                  </View>
                </DropShadow>
              </View>
            </Modal>
          </View>
          {showLogoutModal && (
            <LogoutModal
              show={showLogoutModal}
              closeHandler={() => setShowLogoutModal(false)}
            />
          )}
        </View>
      </SafeAreaView>
    );
  }
}

export default Profile;
