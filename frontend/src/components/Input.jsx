import React from 'react';
function Input({
  label,
  type,
  value,
  onChange,
  placeholder,
  required,
  pattern
}) {
  return (
    <div >
      {label && (
        <label >
          {label}
        </label>
      )}

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
       pattern={pattern}
      />
    </div>
  );
}

export default Input;
