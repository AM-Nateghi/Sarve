import { forwardRef } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CalendarIcon } from '@heroicons/react/24/outline';

// Custom input component
const CustomInput = forwardRef(({ value, onClick, placeholder }, ref) => (
  <button
    onClick={onClick}
    ref={ref}
    type="button"
    className="w-full px-4 py-2 pr-10 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-right relative"
  >
    <CalendarIcon className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-light-text-tertiary dark:text-dark-text-tertiary" />
    <span className={value ? '' : 'text-light-text-tertiary dark:text-dark-text-tertiary'}>
      {value || placeholder}
    </span>
  </button>
));

CustomInput.displayName = 'CustomInput';

const DatePicker = ({ selected, onChange, placeholder = 'انتخاب تاریخ', minDate, maxDate }) => {
  return (
    <div className="datepicker-custom">
      <ReactDatePicker
        selected={selected}
        onChange={onChange}
        customInput={<CustomInput placeholder={placeholder} />}
        dateFormat="yyyy/MM/dd"
        minDate={minDate}
        maxDate={maxDate}
        placeholderText={placeholder}
        calendarStartDay={6}
        showPopperArrow={false}
        popperClassName="datepicker-popper"
        wrapperClassName="w-full"
      />
    </div>
  );
};

export default DatePicker;
