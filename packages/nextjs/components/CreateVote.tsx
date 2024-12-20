import { useState } from "react";
import Button from "./ui/Button";
import InputField from "./ui/InputField";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const CreateVote = () => {
  const [question, setQuestion] = useState<string>("");
  const [options, setOptions] = useState<string[]>([]);
  const [optionInput, setOptionInput] = useState<string>("");
  const [duration, setDuration] = useState<number>(0);

  const { writeContractAsync, isMining } = useScaffoldWriteContract({
    contractName: "VotingContract",
  });

  const addOption = () => {
    if (optionInput.trim()) {
      setOptions([...options, optionInput.trim()]);
      setOptionInput("");
    }
  };

  const createPoll = async () => {
    if (question && options.length > 1 && duration > 0) {
      await writeContractAsync({
        functionName: "createPoll",
        args: [question, options, BigInt(duration)],
      });
    } else {
      alert("Пожалуйста, заполните все поля корректно.");
    }
  };

  return (
    <div className="p-6 bg-white text-black rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Создать голосование</h2>
      <label>Вопрос голосования</label>
      <InputField
        type="text"
        value={question}
        onChange={e => setQuestion(e.target.value)}
        className="w-full p-2 my-2"
      />
      <label>Добавить вариант ответа</label>
      <div className="flex items-center my-2">
        <InputField
          type="text"
          value={optionInput}
          onChange={e => setOptionInput(e.target.value)}
          className="flex-1 p-2 mr-2"
        />
        <Button onClick={addOption} className="bg-green-500 hover:bg-green-600">
          Добавить вариант
        </Button>
      </div>
      <ul className="mb-4">
        {options.map((opt, idx) => (
          <li key={idx} className="text-lg">
            {opt}
          </li>
        ))}
      </ul>
      <label>Длительность (в секундах)</label>
      <InputField
        type="number"
        value={duration}
        onChange={e => setDuration(Number(e.target.value))}
        className="w-full p-2 mt-2 mb-4"
      />
      <Button onClick={createPoll} isLoading={isMining} loadingText="Создание..." className="w-full">
        Создать голосование
      </Button>
    </div>
  );
};

export default CreateVote;
