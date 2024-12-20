import { useState } from "react";
import InputField from "./ui/InputField";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const ResultsVote = () => {
  const [pollId, setPollId] = useState<number>(-1);

  const { data } = useScaffoldReadContract({
    contractName: "VotingContract",
    functionName: "getResults",
    args: [BigInt(pollId)],
  });

  return (
    <div className="p-6 bg-white text-black rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold mb-4">Результаты голосования</h3>
      <label>ID голосования</label>
      <InputField
        type="text"
        onChange={e => setPollId(e.target.value ? Number(e.target.value) : -1)}
        className="w-full p-2 mt-2 mb-4"
      />
      {data && (
        <div className="p-6 bg-blue-500 text-white rounded-lg shadow-lg w-full mx-auto">
          <ul>
            {data[0].map((option: string, idx: number) => (
              <li key={idx} className="text-lg mb-2">
                {option}: {Number(data[1][idx])} голосов
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ResultsVote;
