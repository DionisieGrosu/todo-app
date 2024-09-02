import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { ResetPassword, SignIn, SignUp } from "./types";

export const signIn = ({ email, password }: SignIn) => {
  return new Promise((resolve, reject) => {
    firestore()
      .collection("Users")
      .where("email", "==", email)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.docs.length > 0) {
          auth()
            .signInWithEmailAndPassword(email, password)
            .then((result) => {
              if (result.user) {
                resolve({
                  success: true,
                  message: "User is signed in!",
                  data: result.user,
                });
              } else {
                reject({
                  success: false,
                  message: "Something went wrong whilte trying to authonticate",
                });
              }
              reject({
                success: true,
                message: "Signed in successfuly!",
                data: result,
              });
            })
            .catch((error) => {
              console.log("Signin ERROR");
              console.log(error);
              if (error.code === "auth/email-already-in-use") {
                reject({ success: false, message: "Email is already in use" });
              }

              if (error.code === "auth/invalid-email") {
                reject({ success: false, message: "That email is invalid" });
              }
              if (error.code === "auth/invalid-credential") {
                reject({ success: false, message: "Credentials are invalid" });
              }

              reject({
                success: false,
                message: "Something went wrong whilte trying to authonticate",
              });
            });
        } else {
          reject({ success: false, message: "User not found! Please Sign up" });
        }
      })
      .catch((error) => {
        console.log("GET USER ERROR");
        console.log(error);
        reject({ success: false, message: "User not found! Please Sign up" });
      });
  });
};

export const signUp = async ({
  fullName,
  email,
  password,
  confirmPassword,
}: SignUp) => {
  return new Promise(async (resolve, reject) => {
    if (password !== confirmPassword) {
      reject({
        success: false,
        message: "Password and ConfigrmPassword dont match",
      });
    }
    let checkUser = await firestore()
      .collection("Users")
      .where("email", "==", email)
      .get();
    let userExists = false;
    if (checkUser && checkUser?.docs && checkUser?.docs.length > 0) {
      userExists = true;
    }

    if (userExists) {
      firestore()
        .collection("Users")
        .doc(checkUser?.docs[0].id)
        .update({
          fullName: fullName,
          password: password,
        })
        .then((result) => {
          auth()
            .createUserWithEmailAndPassword(email, password)
            .then((result) => {
              if (result.user) {
                resolve({
                  success: true,
                  message: "User is signed in!",
                  data: result.user,
                });
              } else {
                reject({
                  success: false,
                  message: "Something went wrong whilte trying to authonticate",
                });
              }
              reject({
                success: true,
                message: "Signed in successfuly!",
                data: result,
              });
            })
            .catch((error) => {
              console.log("Signin ERROR");
              console.log(error);
              if (error.code === "auth/email-already-in-use") {
                reject({
                  success: false,
                  message: "Email is already in use",
                });
              }

              if (error.code === "auth/invalid-email") {
                reject({ success: false, message: "That email is invalid" });
              }

              if (error.code === "auth/invalid-credential") {
                reject({ success: false, message: "Credentials are invalid" });
              }

              reject({
                success: false,
                message: "Something went wrong whilte trying to authonticate",
              });
            });
        })
        .catch((error) => {
          console.log("CREATE USER ERROR");
          console.log(error);
          reject({
            success: false,
            message: "Something went wrong whilte trying to create user",
          });
        });
    } else {
      firestore()
        .collection("Users")
        .add({
          fullName: fullName,
          email: email,
          password: password,
        })
        .then((result) => {
          auth()
            .createUserWithEmailAndPassword(email, password)
            .then((result) => {
              if (result.user) {
                resolve({
                  success: true,
                  message: "User is signed in!",
                  data: result.user,
                });
              } else {
                reject({
                  success: false,
                  message: "Something went wrong whilte trying to authonticate",
                });
              }
              reject({
                success: true,
                message: "Signed in successfuly!",
                data: result,
              });
            })
            .catch((error) => {
              console.log("Signin ERROR");
              console.log(error);
              if (error.code === "auth/email-already-in-use") {
                reject({
                  success: false,
                  message: "Email is already in use",
                });
              }

              if (error.code === "auth/invalid-email") {
                reject({ success: false, message: "That email is invalid" });
              }

              reject({
                success: false,
                message: "Something went wrong whilte trying to authonticate",
              });
            });
        })
        .catch((error) => {
          console.log("CREATE USER ERROR");
          console.log(error);
          reject({
            success: false,
            message: "Something went wrong whilte trying to create user",
          });
        });
    }
  });
};

export const resetPassword = ({ email }: ResetPassword) => {
  return new Promise(async (resolve, reject) => {
    firestore()
      .collection("Users")
      .where("email", "==", email)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.docs.length > 0) {
          auth()
            .sendPasswordResetEmail(email)
            .then((result) => {
              resolve({
                success: true,
                message: "Reset password email was sent to your mail account!",
              });
            })
            .catch((error) => {
              console.log("Signin ERROR");
              console.log(error);
              if (error.code === "auth/email-already-in-use") {
                reject({
                  success: false,
                  message: "Email is already in use",
                });
              }

              if (error.code === "auth/invalid-email") {
                reject({ success: false, message: "That email is invalid" });
              }

              reject({
                success: false,
                message: "Something went wrong whilte trying to authonticate",
              });
            });
        } else {
          reject({ success: false, message: "User not found! Please Sign up" });
        }
      })
      .catch((error) => {
        console.log("GET USER ERROR");
        console.log(error);
        reject({ success: false, message: "User not found! Please Sign up" });
      });
  });
};
