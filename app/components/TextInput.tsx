import React from "react";

type TextInputProps = {
  label?: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
};

export function TextInput({
  label,
  value,
  placeholder,
  onChange,
  className = "",
}: TextInputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">
          {label}
        </label>
      )}

      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`input-field ${className}`}
      />
    </div>
  );
}