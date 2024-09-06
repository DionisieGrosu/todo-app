import React from "react";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";

type MenuOption = {
  text: string;
  handler: () => void;
};
type Props = {
  data: MenuOption[];
  icon: React.ReactNode;
};
function MenuPopup({ data, icon }: Props) {
  return (
    <Menu>
      <MenuTrigger customStyles={{}}>{icon}</MenuTrigger>
      <MenuOptions
        customStyles={{
          optionsContainer: {
            borderRadius: 20,
            marginTop: 40,
            backgroundColor: "#F2F2F2",
          },
        }}
      >
        {data.map((item, index) => {
          return (
            <MenuOption
              key={index}
              text={item.text}
              onSelect={item.handler}
              style={{
                paddingTop: 10,
                paddingBottom: 10,
                paddingLeft: 10,
                paddingRight: 10,
              }}
            />
          );
        })}
      </MenuOptions>
    </Menu>
  );
}

export default MenuPopup;
