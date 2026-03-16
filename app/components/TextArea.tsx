import React, { forwardRef } from "react";

type TextAreaProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
};

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ value, onChange, placeholder }, ref) => {

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const el = e.target;

      // auto resize
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";

      onChange(e);
    };

    return (
      <textarea
        ref={ref}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full p-3 border rounded-lg min-h-[120px] resize-none overflow-hidden"
      />
    );
  }
);

TextArea.displayName = "TextArea";