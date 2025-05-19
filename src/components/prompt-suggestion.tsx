import { Card } from './ui/card';

type Props = {
  text: string;
  index: number;
  handleClick: (text: string, index: number) => void;
  selected: number;
};

export function PromptSuggestion({ text, index, handleClick, selected }: Props) {
  return (
    <Card
      className="mt-4 hover:cursor-pointer border-none"
      onClick={() => handleClick(text, index)}
    >
      <button className="p-2 rounded-xl text-left text-sm flex" form="chat" type="submit">
        <div className="w-10">
          <span className={ index == selected ? "opacity-1" : "opacity-0"}>💡</span>
        </div>
        <div className="grow">
          {text}
        </div>
      </button>
    </Card>
  );
}
