import React from "react";
import { View } from "react-native";
import Modal from "react-native-modal";
import CustomButton from "./CustomButton";
import auth from "@react-native-firebase/auth";
import { router } from "expo-router";

type Props = {
  show: boolean;
  closeHandler: () => void;
};
function LogoutModal({ show, closeHandler }: Props) {
  const signoutHandler = () => {
    if (auth().currentUser) {
      auth()
        .signOut()
        .then((result) => {
          router.replace("/");
        });
    }
  };
  return (
    <View>
      <Modal
        onSwipeComplete={closeHandler}
        animationIn={"slideInUp"}
        className="flex flex-1 justify-end px-[24px] m-0"
        isVisible={show}
        swipeDirection="down"
        useNativeDriver={false}
        onBackdropPress={closeHandler}
      >
        <View className="bg-transparent">
          <CustomButton
            buttonClassName="mb-[16px]"
            handler={signoutHandler}
            type="white"
            color="red"
          >
            Logout
          </CustomButton>
          <CustomButton
            buttonClassName="mb-[16px]"
            handler={closeHandler}
            type="white"
            color="green"
          >
            Cancel
          </CustomButton>
        </View>
      </Modal>
    </View>
  );
}

export default LogoutModal;
