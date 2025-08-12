import { EditAssistant } from "@/types";
import React, { FormEvent, useState, useEffect } from "react";
import { Button, Input, Textarea, NumberInput, Select } from "@mantine/core";
import { IconDeviceFloppy, IconTrash } from "@tabler/icons-react";
import assistantStore from "@/utils/assistantStore";
const { Wrapper } = Input;

type Props = {
  assistant: EditAssistant;
  save: (data: EditAssistant) => void;
  remove: (id: string) => void;
};

export const AssistantConfig = ({ assistant, save, remove }: Props) => {
  const [data, setData] = useState<EditAssistant>(assistant);
  const [assistantCount, setAssistantCount] = useState(0);

  useEffect(() => {
    const list = assistantStore.getList();
    setAssistantCount(list.length);
  }, []);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    save(data);
  };
  const onChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setData({
      ...data,
      [name]: value,
    });
  };
  const onNumberChange = (value: number | "", name: string) => {
    if (value === "") return;
    setData({
      ...data,
      [name]: value,
    });
  };

  return (
    <div className="w-full flex justify-center">
      <form onSubmit={onSubmit} className="w-full flex flex-col gap-4">
        <Wrapper label="Name" description="Let's pick a name for the chatbot">
          <Input
            type="text"
            variant="filled"
            value={data.name}
            name="name"
            onChange={onChange}
          ></Input>
        </Wrapper>

        <Wrapper
          label="Model"
          description="Select the OpenAI model to use"
        >
          <Select
            variant="filled"
            data={[
              { value: "gpt-3.5-turbo", label: "gpt-3.5-turbo" },
              { value: "gpt-4o-mini", label: "gpt-4o-mini" },
              { value: "gpt-4o", label: "gpt-4o" },
              { value: "gpt-4-turbo", label: "gpt-4-turbo" },
              { value: "gpt-4", label: "gpt-4" },
            ]}
            value={data.model ?? "gpt-3.5-turbo"}
            onChange={(val) =>
              setData({
                ...data,
                model: val || "gpt-3.5-turbo",
              })
            }
          />
        </Wrapper>

        <Wrapper label="Prompts" description="System prompts assigned to the role">
          <Textarea
            variant="filled"
            className="w-full"
            name="prompt"
            value={data.prompt}
            onChange={onChange}
            autosize
            // maxRows={3}
          ></Textarea>
        </Wrapper>

        <Wrapper
          label="Creativity"
          variant="filled"
          description="The higher the value, the greater the creativity"
        >
          <NumberInput
            type="number"
            variant="filled"
            precision={1}
            max={2}
            min={0}
            step={0.1}
            value={data.temperature}
            name="temperature"
            onChange={(val) => onNumberChange(val, "temperature")}
          />
        </Wrapper>

        <Wrapper
          label="Diversity"
          variant="filled"
          description="Lower values only consider high-probability words"
        >
          <NumberInput
            type="number"
            variant="filled"
            precision={1}
            max={1}
            min={0}
            step={0.1}
            value={data.top_p}
            name="top_p"
            onChange={(val) => onNumberChange(val, "top_p")}
          />
        </Wrapper>

        <Wrapper label="Context Window Size" description="How many previous exchanges the model can remember">
          <NumberInput
            type="number"
            variant="filled"
            max={8}
            min={0}
            step={1}
            value={data.max_log}
            name="max_log"
            onChange={(val) => onNumberChange(val, "max_log")}
          />
        </Wrapper>

        <Wrapper label="Response Length" description="Maximum response length">
          <NumberInput
            type="number"
            variant="filled"
            max={2000}
            min={50}
            step={50}
            value={data.max_tokens}
            name="max_tokens"
            onChange={(val) => onNumberChange(val, "max_tokens")}
          />
        </Wrapper>

        <div className="flex justify-around mt-4">
          <Button style={{ color: 'white', backgroundColor: 'green'}} type="submit" leftIcon={<IconDeviceFloppy size="1.2rem" />}>
            Save
          </Button>
          {data.id && assistantCount > 1 ? (
            <Button
              style={{ color: 'white', backgroundColor: 'red'}} 
              leftIcon={<IconTrash size="1.2rem" />}
              onClick={() => remove(data.id as string)}
            >
              Remove
            </Button>
          ) : null}
        </div>
      </form>
    </div>
  );
};