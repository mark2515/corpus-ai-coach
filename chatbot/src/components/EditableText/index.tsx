import { useState, ChangeEvent, KeyboardEvent } from "react";
import clsx from "clsx";

type IProps = {
  text: string;
  onSave: (name: string) => void;
};

export const EditableText = (props: IProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(props.text);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setText(props.text);
  };

  const handleSave = () => {
    setIsEditing(false);
    props.onSave(text);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setText(props.text);
  };

  const onBlur = () => {
    if (isEditing) {
      handleSave();
    }
  };

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSave();
    } else if (event.key === "Escape") {
      event.preventDefault();
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <input
        className={clsx([
          "w-[10rem]",
          "flex",
          "items-center",
          "h-[2rem]",
          "outline-none",
          "border-0",
        ])}
        type="text"
        value={text}
        onChange={onChange}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        autoFocus
      />
    );
  } else {
    return (
      <div
        className={clsx([
          "leading-9",
          "w-[10rem]",
          "h-[2rem]",
          "overflow-hidden",
          "text-ellipsis",
          "whitespace-nowrap",
        ])}
        onDoubleClick={handleDoubleClick}
      >
        {text}
      </div>
    );
  }
};
