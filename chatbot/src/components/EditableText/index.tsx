import { useState, ChangeEvent } from "react";
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
  };

  const onBlur = () => {
    if (isEditing) {
      setIsEditing(false);
      props.onSave(text);
    }
  };

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
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
