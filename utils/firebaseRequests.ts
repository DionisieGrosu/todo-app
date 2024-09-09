import auth from "@react-native-firebase/auth";
import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import {
  AddTodo,
  DeleteTodo,
  EditPassword as EditPasswordType,
  EditProfile,
  EditTodo,
  GetTodo,
  ResetPassword,
  SignIn,
  SignUp,
} from "./types";
import moment from "moment";

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
          email: email,
          fullName: fullName,
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
      auth()
        .createUserWithEmailAndPassword(email, password)
        .then((result) => {
          if (result.user) {
            firestore()
              .collection("Users")
              .doc(result.user.uid)
              .set({
                fullName: fullName,
                email: email,
              })
              .then((result) => {
                result.user.resolve({
                  success: true,
                  message: "User is signed in!",
                  data: result.user,
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

export const getUserData = () => {
  return new Promise((resolve, reject) => {
    const user = auth().currentUser;
    if (user) {
      firestore()
        .collection("Users")
        .doc(auth().currentUser?.uid)
        .get()
        .then((result) => {
          if (result.exists) {
            resolve({ success: true, data: result.data() });
          } else {
            console.log("ERROR WHILE TRYING TO GET USER");
            console.log(result);
            reject({
              success: false,
              message: "User was not found or some error was occured",
            });
          }
        })
        .catch((error) => {
          console.log("ERROR WHILE TRYING TO GET USER");
          console.log(error);
          reject({
            success: false,
            message: "User was not found or some error was occured",
          });
        });
    } else {
      reject({ success: false, message: "User is not logged in" });
    }
  });
};

export const editProfile = ({ fullName, email, password }: EditProfile) => {
  return new Promise(async (resolve, reject) => {
    const uid = auth().currentUser?.uid;
    console.log("Email");
    console.log(email);
    if (uid) {
      try {
        const checkIfUserExists = await firestore()
          .collection("Users")
          .doc(uid)
          .get();
        if (!checkIfUserExists.exists) {
          reject({
            success: false,
            message: "User was not found! Try to signup",
          });
        }
        // const verifyEmail = await auth().currentUser?.verifyBeforeUpdateEmail(
        //   email
        // );
        if (!auth().currentUser?.email) {
          reject({ success: false, message: "User is not signed in" });
        }

        const provider = auth.EmailAuthProvider;
        const authCredentials = provider.credential(
          auth().currentUser?.email ?? "",
          password
        );

        const reauthanticated =
          await auth().currentUser?.reauthenticateWithCredential(
            authCredentials
          );

        if (!reauthanticated?.user) {
          reject("Something went wrong or password is incorrect");
        }
        const editUserResult = await auth().currentUser?.updateEmail(email);

        const editResult = await firestore()
          .collection("Users")
          .doc(uid)
          .update({ fullName, email });

        const updatedUserData = await firestore()
          .collection("Users")
          .doc(uid)
          .get();

        if (!updatedUserData.exists) {
          reject({
            success: false,
            message: "User was not found! Try to signup",
          });
        }

        resolve({ success: true, data: updatedUserData.data() });
      } catch (error) {
        console.log("EDIT PROFILE ERROR");
        console.log(error);
        reject({
          success: false,
          message: "Something went wrong while trying to edit profile",
        });
      }
    } else {
      reject({ success: false, message: "User is not signed in!" });
    }
  });
};

export const editPassword = ({
  newPassword,
  password,
  confirmPassword,
}: EditPasswordType) => {
  return new Promise(async (resolve, reject) => {
    const uid = auth().currentUser?.uid;
    if (uid) {
      try {
        const checkIfUserExists = await firestore()
          .collection("Users")
          .doc(uid)
          .get();

        if (!checkIfUserExists.exists) {
          reject({
            success: false,
            message: "User was not found! Try to signup",
          });
        }

        const prvider = auth.EmailAuthProvider;

        if (!auth().currentUser?.email) {
          reject({ success: false, message: "User is not authenticated" });
        }

        const authCredentials = prvider.credential(
          auth().currentUser?.email ?? "",
          password
        );
        const reuthanticate =
          await auth().currentUser?.reauthenticateWithCredential(
            authCredentials
          );

        if (!reuthanticate?.user) {
          reject("Something went wrong or password is incorrect");
        }

        const editUserResult = await auth().currentUser?.updatePassword(
          newPassword
        );

        const updatedUserData = await firestore()
          .collection("Users")
          .doc(uid)
          .get();

        if (!updatedUserData.exists) {
          reject({
            success: false,
            message: "User was not found! Try to signup",
          });
        }

        resolve({ success: true, data: updatedUserData.data() });
      } catch (error) {
        reject({
          success: false,
          message: "Something went wrong while trying to edit profile",
        });
      }
    } else {
      reject({ success: false, message: "User is not signed in!" });
    }
  });
};

export const getTodos = (filter: "all" | "by_time" | "by_deadline" = "all") => {
  return new Promise((resolve, reject) => {
    let queryResult = firestore().collection("Todos");
    if (filter == "by_time") {
      queryResult = queryResult.where("date", "==", "");
    }
    if (filter == "by_deadline") {
      queryResult = queryResult.where("date", "!=", "");
    }
    queryResult
      .get()
      .then((result) => {
        let TodosData: FirebaseFirestoreTypes.DocumentData[] = [];
        result.docs.map((item) => {
          TodosData.push({ ...item.data(), id: item.id });
        });
        resolve({ success: true, data: TodosData });
      })
      .catch((error) => {
        console.log("ERROR WHILE TRYING TO GET ALL TODOS");
        console.log(error);
        reject({
          success: false,
          message: "Something went wrong while trying to get todos",
        });
      });
  });
};

export const getTodoById = ({ id }: { id: string }) => {
  return new Promise((resolve, reject) => {
    firestore()
      .collection("Todos")
      .doc(id)
      .get()
      .then((result) => {
        if (result.exists) {
          resolve({ success: true, data: { ...result.data(), id: id } });
        } else {
          reject({ success: false, message: "Data is empty" });
        }
      })
      .catch((error) => {
        console.log("ERROR WHILE TRYING TO GET TODO");
        console.log(error);
        reject({
          success: false,
          message: "Something went wrong while trying to get todo",
        });
      });
  });
};

export const addNewTodo = ({ title, description, date = "" }: AddTodo) => {
  return new Promise(async (resolve, reject) => {
    firestore()
      .collection("Todos")
      .add({
        title,
        description,
        date,
        createdAt: moment().format("YYYY-MM-DD"),
      })
      .then(() => {
        firestore()
          .collection("Todos")
          .get()
          .then((result) => {
            console.log("ADDED TODO RESULT DATA");
            console.log(result.docs[0].data);
            let resultData: FirebaseFirestoreTypes.DocumentData[] = [];
            result.docs.map((item) => {
              resultData.push({ ...item.data(), id: item.id });
            });
            resolve({ success: true, data: resultData });
          })
          .catch((error) => {
            console.log("GET TODO ERROR");
            console.log(error);
            reject({
              success: false,
              message: "Somethng went wrong while trying to get todos",
            });
          });
      })
      .catch((addError) => {
        console.log("ADD TODO ERROR");
        console.log(addError);
        reject({
          success: false,
          message: "Somethng went wrong while trying to add todo",
        });
      });
  });
};

export const editTodo = ({ id, title, description, date = "" }: EditTodo) => {
  return new Promise(async (resolve, reject) => {
    firestore()
      .collection("Todos")
      .doc(id)
      .update({
        title,
        description,
        date,
      })
      .then(() => {
        firestore()
          .collection("Todos")
          .doc(id)
          .get()
          .then((result) => {
            if (result.data()) {
              resolve({
                success: true,
                data: { ...result.data(), id: result.id },
              });
            } else {
              reject({ success: false, message: "Data is empty" });
            }
          })
          .catch((error) => {
            console.log("GET TODO ERROR");
            console.log(error);
            reject({
              success: false,
              message: "Something went wrong while trying to get todo",
            });
          });
        // firestore()
        //   .collection("Todo")
        //   .get()
        //   .then((result) => {
        //     resolve({ success: true, data: result.docs });
        //   })
        //   .catch((error) => {
        //     console.log("GET TODO ERROR");
        //     console.log(error);
        //     reject({
        //       success: false,
        //       message: "Somethng went wrong while trying to get todos",
        //     });
        //   });
      })
      .catch((addError) => {
        console.log("ADD TODO ERROR");
        console.log(addError);
        reject({
          success: false,
          message: "Somethng went wrong while trying to add todo",
        });
      });
  });
};

export const deleteTodo = ({ id }: DeleteTodo) => {
  return new Promise((resolve, reject) => {
    firestore()
      .collection("Todos")
      .doc(id)
      .delete()
      .then((result) => {
        resolve({ success: true, message: "Todo was deleted successfuly!" });
      })
      .catch((error) => {
        console.log("ERROR WHILE TRYING TO DELETE TODO");
        console.log(error);
        reject({
          success: false,
          message: "Something went wrong while trying to delete todo",
        });
      });
  });
};
