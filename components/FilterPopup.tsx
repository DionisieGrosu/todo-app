import React from "react";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";

type FilterOption = {
  text: string;
  handler: () => void;
  active: boolean;
};
type Props = {
  data: FilterOption[];
  icon: React.ReactNode;
};
function FilterPopup({ data, icon }: Props) {
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
              customStyles={{
                optionText: item.active
                  ? { color: "#F76C6A" }
                  : { color: "#272727" },
              }}
              style={[
                {
                  paddingTop: 10,
                  paddingBottom: 10,
                  paddingLeft: 10,
                  paddingRight: 10,
                },
              ]}
            />
          );
        })}
      </MenuOptions>
    </Menu>
  );
}

export default FilterPopup;
