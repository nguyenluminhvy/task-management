import {TouchableOpacity, View} from "react-native";
import {Text, Button, Modal, Portal, Icon, MD3Colors} from "react-native-paper";
import React, {useEffect, useState} from "react";
import moment from "moment";
import {PRIORITY_BUTTONS, STATUS_BUTTONS} from "@/app/task/[taskId]";
import {TaskPriority, TaskStatus} from "@/lib/constants/task";
import {PickDateButton} from "@/lib/components/ui/PickDateButton";
import {AppSwitch} from "@/lib/components/ui/AppSwitch";

export type DateRange = {
  start: Date;
  end: Date;
};

export type AdvancedFilterValue = {
  status?: TaskStatus | undefined;
  priority?: TaskPriority | undefined;
  range: DateRange | undefined;
};

interface AdvancedFilterModalProps {
  value: AdvancedFilterValue;
  onChange: (data: AdvancedFilterValue) => void;
}

const defaultRange = {
  start: moment().startOf('month').toDate(),
  end: moment().endOf('month').toDate(),
}

export function AdvancedFilterModal({ onChange, value }: AdvancedFilterModalProps) {
  const [visible, setVisible] = useState(false);
  const [filters, setFilters] = useState<AdvancedFilterValue>({
    status: undefined,
    priority: undefined,
    range: {
      start: moment().startOf('month').toDate(),
      end: moment().endOf('month').toDate(),
    }
  });
  const [isSwitchOn, setIsSwitchOn] = useState(false);

  useEffect(() => {
    if (!value.range) {
      setFilters({...value, range: defaultRange})
      setIsSwitchOn(false);
    } else {
      setFilters(value)
    }
  }, [value]);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const onApplyFilter = () => {
    const data = {...filters};

    if (!isSwitchOn) data.range = undefined;

    onChange?.(data);
    hideModal()
  }

  const onCancelFilter = () => {
    hideModal()
    setTimeout(() => {
      setFilters(value)
      if (!value.range) setIsSwitchOn(false);
    }, 200)
  }

  const hasFilter = !!filters.status || !!filters.priority || isSwitchOn;

  return (
    <View>
      <TouchableOpacity style={{paddingRight: 12}} onPress={showModal}>
        <Icon source="filter-outline" color={hasFilter ? '#006EE9' : MD3Colors.neutralVariant60} size={24} />
      </TouchableOpacity>

      <Portal>
        <Modal
          visible={visible} onDismiss={hideModal}
          contentContainerStyle={{
            backgroundColor: 'white',
            padding: 20,
            marginHorizontal: 16,
            borderRadius: 8,
            gap: 16
          }}>

          <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
            <Text variant={'titleLarge'} style={{ color: "#006EE9", fontWeight: "bold" }}>
              Advanced Filter
            </Text>
            <Icon source="filter-outline" color={'#006EE9'} size={28} />
          </View>


          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16}}>
            <Text style={{ color: "#006EE9", fontWeight: "bold" }}>
              Date range
            </Text>

            <AppSwitch value={isSwitchOn} onchange={setIsSwitchOn}/>
          </View>


          <View
            style={{
              // flex: 1,
              // flexDirection: "row",
              // justifyContent: 'space-between',
              opacity: isSwitchOn ? 1 : 0.3
            }}
          >
            <View style={{  gap: 8, minWidth: 150 }}>
              <Text style={{ color: "#006EE9", fontWeight: "bold" }}>
                From
              </Text>
              <PickDateButton
                disabled={!isSwitchOn}
                buttonColor={"#EEF5FD"}
                textColor={"#006EE9"}
                style={{
                  borderWidth: 0.5,
                  borderRadius: 12,
                  borderColor: "rgba(0,110,233,0.4)",
                }}
                dateDefault={filters?.range?.start}
                onDateChange={(date) => setFilters(prev => ({ ...prev, range: {...prev.range, start: date } }))}
              />
            </View>

            <View style={{ gap: 8, minWidth: 150 }}>
              <Text style={{ color: "#006EE9", fontWeight: "bold" }}>To</Text>

              <PickDateButton
                disabled={!isSwitchOn}
                buttonColor={"#EEF5FD"}
                textColor={"#006EE9"}
                style={{
                  borderWidth: 0.5,
                  borderRadius: 12,
                  borderColor: "rgba(0,110,233,0.4)",
                }}
                dateDefault={filters?.range?.end}
                onDateChange={(date) => setFilters(prev => ({ ...prev, range: {...prev.range, end: date } }))}
              />
            </View>
          </View>

          <View
            style={{
              gap: 8,
            }}
          >
            <Text style={{ color: "#006EE9", fontWeight: "bold" }}>
              Status
            </Text>
            <View
              style={{
                flexDirection: "row",
                gap: 8,
              }}
            >
              {STATUS_BUTTONS.map((button, index) => {
                const isActive = button.type === filters.status;

                return (
                  <TouchableOpacity
                    key={index}
                    style={{
                      paddingVertical: 8,
                      paddingHorizontal: 16,
                      borderRadius: 50,
                      backgroundColor: isActive ? "#006EE9" : "#F4F9FF"
                    }}
                    onPress={() => {
                      setFilters(prev => ({ ...prev, status: isActive ? undefined : button.type }));
                    }}
                  >
                    <Text variant={"labelLarge"} style={{
                      color: isActive ? "white" : "black"
                    }}>
                      {button.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View
            style={{
              gap: 8,
            }}
          >
            <Text style={{ color: "#006EE9", fontWeight: "bold" }}>
              Priority
            </Text>
            <View
              style={{
                flexDirection: "row",
                gap: 8,
              }}
            >
              {PRIORITY_BUTTONS.map((button, index) => {
                const isActive = button.type === filters.priority;

                return (
                  <TouchableOpacity
                    key={index}
                    style={{
                      paddingVertical: 8,
                      paddingHorizontal: 16,
                      borderRadius: 50,
                      backgroundColor: isActive ? "#006EE9" : "#F4F9FF"
                    }}
                    onPress={() => {
                      setFilters(prev => ({ ...prev, priority: isActive ? undefined : button.type }));
                    }}
                  >
                    <Text variant={"labelLarge"} style={{
                      color: isActive ? "white" : "black"
                    }}>
                      {button.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            gap: 16,
            marginTop: 16
          }}>

            <Button
              mode="contained"
              buttonColor={"#F4F9FF"}
              textColor={"grey"}
              style={{
                flex: 1,
                borderRadius: 12,
              }}
              onPress={onCancelFilter}
            >
              {"Cancel"}
            </Button>

            <Button
              mode="contained"
              buttonColor={"#F4F9FF"}
              textColor={"#006EE9"}
              contentStyle={{}}
              style={{
                flex: 1,
                borderRadius: 12,
              }}
              onPress={onApplyFilter}
            >
              {"Apply"}
            </Button>
          </View>

        </Modal>
      </Portal>
    </View>
  );
}
