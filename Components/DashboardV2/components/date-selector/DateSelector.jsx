import * as React from "react";
import { cls } from "../../lib/utils";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../ui/select/select";
import {
  DateRangePicker,
  DateRangePickerContent,
  DateRangePickerTrigger,
} from "../ui/date-range-picker/date-range-picker";
import globalStyles from "../../global.module.css";
import { Button } from "../ui/button/button";
import { Calendar } from "lucide-react";
import styles from "./date-selector.module.css";
import { format } from "date-fns";

export const DateSelector = ({
  children,
  defaultValue,
  placeholder,
  showCalender = false,
  calenderTrigger = "custom",
  value: externalValue,
  onValueChange,
  ...props
}) => {
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [triggerText, setTriggerText] = React.useState("Select dates");
  const calendarButtonRef = React.useRef(null);

  const value = externalValue !== undefined ? externalValue : internalValue;

  React.useEffect(() => {
    if (value === calenderTrigger && calendarButtonRef.current) {
      calendarButtonRef.current.click();
    }
  }, [value, calenderTrigger]);

  const handleValueChange = newValue => {
    setInternalValue(newValue);
    onValueChange?.(newValue);

    if (newValue !== calenderTrigger) {
      setStartDate(null);
      setEndDate(null);
    }
  };

  const handleStartDateChange = date => {
    setStartDate(date);
  };

  const handleEndDateChange = date => {
    setEndDate(date);
    if (date && startDate) {
      handleValueChange(calenderTrigger);
    }
  };

  React.useEffect(() => {
    const getDisplayText = () => {
      if (startDate && endDate) {
        return `${format(startDate, "MMM d")} - ${format(endDate, "MMM d")}`;
      }

      return "Select dates";
    };
    if (value === calenderTrigger) {
      setTriggerText(getDisplayText());
    }
  }, [value, startDate, endDate]);

  console.log(triggerText);

  return (
    <div className={cls(globalStyles["flex-center"])}>
      <Select
        defaultValue={defaultValue}
        value={value}
        onValueChange={handleValueChange}
        {...props}
      >
        <SelectTrigger aria-label="Select a value">
          {value === calenderTrigger ? (
            <SelectValue placeholder={triggerText}>
              {triggerText.trim() === "" ? "Select dates" : triggerText}
            </SelectValue>
          ) : (
            <SelectValue placeholder={placeholder || "Today"} />
          )}
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
      {showCalender && (
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
        >
          <DateRangePickerTrigger asChild>
            <Button
              ref={calendarButtonRef}
              variant="outline"
              size="icon"
              className={cls(
                globalStyles.small_button,
                globalStyles.calendar_button,
                value === calenderTrigger
                  ? globalStyles.ring
                  : "box-shadow-none"
              )}
            >
              <Calendar />
            </Button>
          </DateRangePickerTrigger>
          <DateRangePickerContent />
        </DateRangePicker>
      )}
    </div>
  );
};
