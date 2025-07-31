import { View } from "react-native";
import { Text, Button, ButtonProps } from "react-native-paper";
import React, { useState } from "react";
import DatePicker from "react-native-date-picker";
import moment from "moment";

export interface PickDateButtonProps extends ButtonProps {
  onDateChange: (date: Date) => void;
  dateDefault: Date | null;
}

export function PickDateButton({
  buttonColor,
  textColor,
  style,
  dateDefault,
  onDateChange,
}: Partial<PickDateButtonProps>) {
  const [date, setDate] = useState(dateDefault || new Date());
  const [openPicker, setOpenPicker] = useState(false);

  const onChange = (date: Date) => {
    setOpenPicker(false);
    setDate(date);
    onDateChange?.(date);
  };

  return (
    <View>
      <Button
        icon="calendar"
        mode="outlined"
        onPress={() => setOpenPicker(true)}
        buttonColor={buttonColor}
        textColor={textColor}
        style={style}
        contentStyle={{
          paddingVertical: 4,
        }}
      >
        <Text style={{ color: "black" }}>
          {moment(date).format("MMM-DD-YYYY")}
        </Text>
      </Button>

      <DatePicker
        modal
        open={openPicker}
        mode={"datetime"}
        date={date}
        onConfirm={onChange}
        onCancel={() => {
          setOpenPicker(false);
        }}
      />
    </View>
  );
}
