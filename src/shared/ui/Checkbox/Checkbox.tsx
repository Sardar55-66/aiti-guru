import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  style?: React.CSSProperties;
}

const Checkbox: React.FC<CheckboxProps> = ({ checked = false, onCheckedChange, style, ...rest }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onCheckedChange?.(e.target.checked);
  };

  return (
    <label
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 22,
        height: 22,
        cursor: 'pointer',
        flexShrink: 0,
        ...style,
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        {...rest}
        style={{
          position: 'absolute',
          opacity: 0,
          width: 22,
          height: 22,
          margin: 0,
          cursor: 'pointer',
        }}
      />
      <span
        style={{
          width: 22,
          height: 22,
          borderRadius: 4,
          border: '1px solid #B2B3B9',
          backgroundColor: checked ? '#3C538E' : 'transparent',
          boxSizing: 'border-box',
        }}
      />
    </label>
  );
};

export default Checkbox;
