import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { DateRange } from 'react-day-picker';
import { Button } from './ui/button';

interface PopoverCalendarRangeProps {
  children: React.ReactNode;
  onChange: (date?: DateRange) => void;
}

const PopoverCalendarRange = ({
  children,
  onChange,
}:PopoverCalendarRangeProps) => {
  const [open, setOpen] = React.useState(false);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>()

  const handleOnOpenChange = (open: boolean) => {
    setOpen(open);
  };

  const handleOnChangeDate = () => {
    handleOnOpenChange(false);
    if (onChange) {
      if(dateRange){
        onChange(dateRange);
      }
    }
  };

  const handleOnClear = () => {
handleOnOpenChange(false);
    if (onChange) {
      setDateRange(undefined)
      onChange(undefined);
    }
  }

  return (
    <Popover open={open} onOpenChange={handleOnOpenChange}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="range"
          selected={dateRange}
          captionLayout="dropdown"
          defaultMonth={dateRange?.from}
          onSelect={setDateRange}
        />
        <div className={`flex gap-2 justify-end pb-2 pr-2`}>
          <Button variant={`outline`} onClick={handleOnClear}>
            รีเซ็ต
          </Button>
          <Button onClick={handleOnChangeDate}>
            ยืนยัน
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default PopoverCalendarRange