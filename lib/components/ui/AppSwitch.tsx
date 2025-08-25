import {Switch} from "react-native";
import React, {useState} from "react";
import {isIos} from "@/lib/utils/helper";

export function AppSwitch({ value = false, onchange }) {
  const [isSwitchOn, setIsSwitchOn] = useState(value);

  const onToggleSwitch = () => {
    const nextValue = !isSwitchOn;

    setIsSwitchOn(nextValue)
    onchange?.(nextValue);
  };

  return (
    <Switch
      trackColor={{
        false: 'rgba(52, 120, 245, 0.2)',
        true: 'rgba(52, 120, 245, 1)',
      }}
      thumbColor={'rgba(255, 255, 255, 1)'}
      ios_backgroundColor="rgba(52, 120, 245, 0.2)"
      onValueChange={onToggleSwitch}
      value={isSwitchOn}
      style={{
        transform: [
          {
            scale: isIos ? 0.7 : 1,
          },
        ],
      }}
    />
  );
}
