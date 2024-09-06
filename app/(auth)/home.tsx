import FilterPopup from "@/components/FilterPopup";
import Loader from "@/components/Loader";
import MenuPopup from "@/components/MenuPopup";
import RoundedButton from "@/components/RoundedButton";
import TodoItem from "@/components/TodoItem";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Octicons from "@expo/vector-icons/Octicons";
import { Link, router, useFocusEffect, useNavigation } from "expo-router";
import Modal from "react-native-modal";
import CustomInput from "@/components/CustomInput";
import moment from "moment";
import CustomDatePickerInput from "@/components/CustomDatePickerInput";
import CustomButton from "@/components/CustomButton";
import DateTimePicker, { DateType } from "react-native-ui-datepicker";
import dayjs from "dayjs";
import { addNewTodo, getTodos } from "@/utils/firebaseRequests";
import { z } from "zod";
import { Toast } from "react-native-toast-notifications";
import auth from "@react-native-firebase/auth";

type Todo = {
  id: string;
  title: string;
  description: string;
  date?: string;
  createdAt: string;
};
function Home() {
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<DateType | string>("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [titleError, setTitleError] = useState<boolean>(false);
  const [filter, setFilter] = useState<"all" | "by_time" | "by_deadline">(
    "all"
  );
  // const navigation = useNavigation();
  // const focused = navigation.isFocused();

  const AddTodo = z.object({
    title: z.string().min(3, "Title must contain at least 3 characters"),
  });
  type AddTodo = z.infer<typeof AddTodo>;

  useEffect(() => {
    getTodos(filter)
      .then((result: any) => {
        if (result.success && result.data) {
          setTodos(result.data);
        } else {
          setTodos([]);
        }
      })
      .catch((error) => {
        setTodos([]);
      });
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getTodos(filter)
        .then((result: any) => {
          if (result.success && result.data) {
            setTodos(result.data);
          } else {
            setTodos([]);
          }
        })
        .catch((error) => {
          setTodos([]);
        });
    }, [])
  );

  useEffect(() => {
    getTodos(filter)
      .then((result: any) => {
        if (result.success && result.data) {
          setTodos(result.data);
        } else {
          setTodos([]);
        }
      })
      .catch((error) => {
        setTodos([]);
      });
  }, [filter]);

  useEffect(() => {
    if (showDatePicker) {
      setShowDatePicker(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    setTitle("");
    setDescription("");
    setSelectedDate("");
  }, [showModal]);

  const addTodoHandler = () => {
    setTitleError(false);
    let validate = AddTodo.safeParse({
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
      setShowModal(false);
      setLoading(true);
      addNewTodo({
        title,
        description,
        date: selectedDate
          ? moment(selectedDate.toLocaleString()).format("YYYY-MM-DD")
          : "",
      })
        .then((result: any) => {
          setLoading(false);
          if (result.success) {
            setTodos(result.data);
          } else {
            Toast.show(result.message);
          }
        })
        .catch((error) => {
          setLoading(false);
          Toast.show(error.message);
        });
    }
  };

  const signOutHandler = () => {
    auth()
      .signOut()
      .then((result) => {
        router.replace("/");
      });
  };

  if (loading) {
    return <Loader />;
  } else {
    return (
      <SafeAreaView style={{ flex: 1, flexGrow: 1 }}>
        <View className="flex flex-1 bg-white py-[24px]">
          <View className="flex flex-row justify-between px-[24px] items-center">
            <Text className="text-custom-orange font-bregular text-[36px] uppercase">
              To do list
            </Text>
            <View>
              <MenuPopup
                data={[
                  { text: "Profile", handler: () => {} },
                  { text: "Exit", handler: () => signOutHandler() },
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
          <View className="flex flex-row justify-between px-[24px] mt-[45px] mb-[17px]">
            <View className="flex flex-row items-center">
              <Image
                source={require("./../../assets/images/Union_new.png")}
                className="w-[25px] h-[25px] mr-[10px]"
              />
              <Text className="text-dark-orange font-bregular text-[36px] uppercase tracking-tighter">
                List of Todo
              </Text>
            </View>
            <View>
              <FilterPopup
                data={[
                  {
                    text: "All",
                    handler: () => setFilter("all"),
                    active: filter == "all",
                  },
                  {
                    text: "By time",
                    handler: () => setFilter("by_time"),
                    active: filter == "by_time",
                  },
                  {
                    text: "Deadline",
                    handler: () => setFilter("by_deadline"),
                    active: filter == "by_deadline",
                  },
                ]}
                icon={
                  <Image
                    source={require("./../../assets/images/filter.png")}
                    className="w-[24px] h-[24px]"
                  />
                }
              />
            </View>
          </View>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View className="flex-1 px-[24px]">
              {todos &&
                todos.map((item, index) => {
                  return (
                    <TodoItem
                      onPress={() => router.push("/(auth)/todo/" + item.id)}
                      key={item.id}
                      title={item.title}
                      text={item.description}
                      date={item.date}
                      createdAt={`Created at ${moment(item.createdAt).format(
                        "MMMM Do YYYY"
                      )}`}
                    />
                  );
                })}
            </View>
          </ScrollView>
          <RoundedButton
            classes="absolute bottom-6 right-6"
            handler={() => setShowModal(true)}
          >
            <Octicons name="plus" size={45} color="white" />
          </RoundedButton>
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
                    handler={() => addTodoHandler()}
                    type="white"
                    color="orange"
                  >
                    Add Todo
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
        </View>
      </SafeAreaView>
    );
  }
}

export default Home;
