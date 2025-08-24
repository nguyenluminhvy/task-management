import { View } from "react-native";
import { Text, Button, ButtonProps } from "react-native-paper";
import React, {useEffect, useState} from "react";
import DatePicker from "react-native-date-picker";
import moment from "moment";

export interface PickDateButtonProps extends ButtonProps {
  onDateChange: (date: Date) => void;
  dateDefault: Date | null;
  calendarMode?: 'date' | 'time' | 'datetime'
  format?: string
}

export function PickDateButton({
                                 buttonColor,
                                 textColor,
                                 style,
                                 dateDefault,
                                 onDateChange,
                                 calendarMode = "date",
                                 format = "MMM-DD-YYYY",
                                 disabled = false
                               }: Partial<PickDateButtonProps>) {
  const [date, setDate] = useState(dateDefault || new Date());
  const [openPicker, setOpenPicker] = useState(false);

  useEffect(() => {
    if (dateDefault) {
      setDate(dateDefault)
    }
  }, [dateDefault])

  const onChange = (date: Date) => {
    setOpenPicker(false);
    setDate(date);
    onDateChange?.(date);
  };

  return (
    <View>
      <Button
        disabled={disabled}
        icon={calendarMode === "time" ? "clock" : "calendar"}
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
          {moment(date).format(format)}
        </Text>
      </Button>

      <DatePicker
        modal
        open={openPicker}
        mode={calendarMode}
        date={date}
        onConfirm={onChange}
        onCancel={() => {
          setOpenPicker(false);
        }}
      />
    </View>
  );
}
