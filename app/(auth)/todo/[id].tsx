import Loader from "@/components/Loader";
import { deleteTodo, editTodo, getTodoById } from "@/utils/firebaseRequests";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toast } from "react-native-toast-notifications";
import DateTimePicker, { DateType } from "react-native-ui-datepicker";
import Modal from "react-native-modal";
import CustomButton from "@/components/CustomButton";
import CustomDatePickerInput from "@/components/CustomDatePickerInput";
import CustomInput from "@/components/CustomInput";
import { z } from "zod";

type Todo = {
  id: string;
  title: string;
  description: string;
  date?: string;
  createdAt: string;
};

function Todo() {
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [createdDate, setCreatedDate] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<DateType | string>("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [titleError, setTitleError] = useState<boolean>(false);

  const { id } = useLocalSearchParams<{ id: string }>();

  useEffect(() => {
    getTodoById({ id: id })
      .then((result) => {
        setLoading(false);
        if (result.success) {
          if (result.data.title) {
            setTitle(result.data.title);
          }
          if (result.data.description) {
            setDescription(result.data.description);
          }
          if (result.data.createdAt) {
            setCreatedDate(result.data.createdAt);
          }
          if (result.data.date) {
            setSelectedDate(result.data.date);
          }
        } else {
          if (result.message) {
            Toast.show(result.message);
          }
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log("ERROR GETTING TODO BY ID");
        console.log(error);
        Toast.show("Something went wrong while trying to get todo by id");
      });
  }, []);

  useEffect(() => {
    if (showDatePicker) {
      setShowDatePicker(false);
    }
  }, [selectedDate]);

  const EditTodo = z.object({
    title: z.string().min(3, "Title must contain at least 3 characters"),
  });
  type EditTodo = z.infer<typeof EditTodo>;

  const editTodoHandler = () => {
    setTitleError(false);
    let validate = EditTodo.safeParse({
      title,
    });
    let errors = false;
    if (!validate.success) {
      errors = true;
      setShowModal(false);
      if (validate.error?.formErrors) {
        if (validate.error?.formErrors.fieldErrors.title) {
          setTitleError(true);
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
      editTodo({
        id,
        title,
        description,
        date: selectedDate
          ? moment(selectedDate.toLocaleString()).format("YYYY-MM-DD")
          : "",
      })
        .then((result) => {
          setShowModal(false);
          if (result.success) {
            if (result.data.title) {
              setTitle(result.data.title);
            }
            if (result.data.description) {
              setDescription(result.data.description);
            }
            if (result.data.createdAt) {
              setCreatedDate(result.data.createdAt);
            }
            if (result.data.date) {
              setSelectedDate(result.data.date);
            }
            Toast.show("Todo was updated successfuly!", { type: "success" });
          } else {
            console.log("EDIT TODO ERROR");
            console.log(result);
            Toast.show("Somehting went wrong while trying to edit todo");
          }
        })
        .catch((error) => {
          console.log("EDIT TODO ERROR");
          console.log(error);
          setShowModal(false);
          Toast.show("Somehting went wrong while trying to edit todo");
        });
    }
  };

  const deleteDate = () => {
    setSelectedDate("");
    editTodo({ id, title, description, date: "" })
      .then((result) => {
        setShowModal(false);
        if (result.success) {
          if (result.data.title) {
            setTitle(result.data.title);
          }
          if (result.data.description) {
            setDescription(result.data.description);
          }
          if (result.data.createdAt) {
            setCreatedDate(result.data.createdAt);
          }
          if (result.data.date) {
            setSelectedDate(result.data.date);
          }
          Toast.show("Todo was updated successfuly!", { type: "success" });
        } else {
          console.log("EDIT TODO ERROR");
          console.log(result);
          Toast.show("Somehting went wrong while trying to edit todo");
        }
      })
      .catch((error) => {
        console.log("EDIT TODO ERROR");
        console.log(error);
        setShowModal(false);
        Toast.show("Somehting went wrong while trying to edit todo");
      });
  };

  const deleteTodoHandler = () => {
    setLoading(true);
    deleteTodo({ id })
      .then((result) => {
        setLoading(false);
        if (result.success) {
          Toast.show(result.message, {
            type: "success",
          });
          router.replace("/(auth)/home");
        } else {
          if (result.message) {
            Toast.show(result.message);
          } else {
            Toast.show("Somehting went wrong while trying to edit todo");
          }
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log("DELETE TODO ERROR");
        console.log(error);
        setShowDeleteModal(false);
        Toast.show("Somehting went wrong while trying to edit todo");
      });
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
                source={require("./../../../assets/images/chevron-left.png")}
                className="w-[24px] h-[24px]"
              />
            </Pressable>
            <View className="flex flex-row gap-3">
              <Pressable onPress={() => deleteDate()}>
                {selectedDate ? (
                  <Image
                    source={require("./../../../assets/images/clock.png")}
                    className="w-[24px] h-[24px]"
                  />
                ) : (
                  <Image
                    source={require("./../../../assets/images/clock-disabled.png")}
                    className="w-[24px] h-[24px]"
                  />
                )}
              </Pressable>
              <Pressable onPress={() => setShowModal(true)}>
                <Image
                  source={require("./../../../assets/images/edit-2.png")}
                  className="w-[24px] h-[24px]"
                />
              </Pressable>
              <Pressable onPress={() => setShowDeleteModal(true)}>
                <Image
                  source={require("./../../../assets/images/trash-2.png")}
                  className="w-[24px] h-[24px]"
                />
              </Pressable>
            </View>
          </View>
          <View className="flex-1">
            <Text className="font-bregular text-[26px] mb-[24px]">{title}</Text>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <View>
                <Text className="font-mregular text-[16px] text-[#272727] leading-8">
                  {description}
                </Text>
              </View>
            </ScrollView>
          </View>
          <View>
            <Text className="text-center my-[17px] font-mregular text-[14px]">
              Created at {moment(createdDate).format("MMMM Do YYYY")}
            </Text>
          </View>
        </View>
        <View>
          <Modal
            backdropColor="transparent"
            onSwipeComplete={() => setShowModal(false)}
            animationIn={"slideInUp"}
            className="flex p-0 m-0 justify-end"
            isVisible={showModal}
            swipeDirection="down"
            useNativeDriver={false}
          >
            <View className="flex-1 bg-[#F79E89] rounded-[24px] max-h-[100%] px-[24px]">
              <View className="flex h-[30px] w-full justify-center items-center">
                <View className="w-[80px] h-[6px] bg-white rounded-full"></View>
              </View>
              <View className="fle flex-1 flex-col mt-[20px]">
                <CustomInput
                  value={title}
                  onInputHandler={setTitle}
                  label="Title"
                  styleType="white"
                  error={titleError}
                />
                <CustomInput
                  value={description}
                  onInputHandler={setDescription}
                  label="Description"
                  styleType="white"
                  textarea={true}
                  inputClasses="flex-1"
                />
                <CustomDatePickerInput
                  value={selectedDate?.toLocaleString()}
                  clickHandler={() => setShowDatePicker(true)}
                  label="Deadline (optional)"
                  styleType="white"
                />
                <CustomButton
                  buttonClassName="mb-[16px]"
                  handler={() => editTodoHandler()}
                  type="white"
                  color="orange"
                >
                  Edit Todo
                </CustomButton>
              </View>
            </View>
          </Modal>
        </View>
        <View>
          <Modal
            onSwipeComplete={() => setShowDatePicker(false)}
            animationIn={"slideInUp"}
            className="flex px-[24px] m-0 justify-center"
            isVisible={showDatePicker}
            swipeDirection="down"
            useNativeDriver={false}
            onBackdropPress={() => setShowDatePicker(false)}
          >
            <View className="rounded-[24px] bg-[#090D09]">
              <DateTimePicker
                headerButtonColor="#CB6025"
                headerTextStyle={{ color: "#F79E89" }}
                calendarTextStyle={{ color: "#DACCAB" }}
                todayTextStyle={{ color: "#ffffff" }}
                weekDaysTextStyle={{ color: "#DACCAB" }}
                todayContainerStyle={{
                  backgroundColor: "transparent",
                  borderColor: "#F79E89",
                }}
                selectedTextStyle={{ color: "#fff" }}
                selectedItemColor="#F79E89"
                mode="single"
                date={
                  selectedDate ? selectedDate : moment().format("YYYY-MM-DD")
                }
                onChange={(params) => setSelectedDate(params.date)}
              />
            </View>
          </Modal>
        </View>
        <View>
          <Modal
            onSwipeComplete={() => setShowDeleteModal(false)}
            animationIn={"slideInUp"}
            className="flex flex-1 justify-end px-[24px] m-0"
            isVisible={showDeleteModal}
            swipeDirection="down"
            useNativeDriver={false}
            onBackdropPress={() => setShowDeleteModal(false)}
          >
            <View className="bg-transparent">
              <CustomButton
                buttonClassName="mb-[16px]"
                handler={() => deleteTodoHandler()}
                type="white"
                color="red"
              >
                Delete Todo
              </CustomButton>
              <CustomButton
                buttonClassName="mb-[16px]"
                handler={() => setShowDeleteModal(false)}
                type="white"
                color="green"
              >
                Cancel
              </CustomButton>
            </View>
          </Modal>
        </View>
      </SafeAreaView>
    );
  }
}

export default Todo;
