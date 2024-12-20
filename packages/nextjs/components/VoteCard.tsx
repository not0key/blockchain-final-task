import { FC } from "react";
import Button from "./ui/Button";
import EntVote from "~~/components/EndVote";
import UserVoted from "~~/components/UserVoted";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { IPoll } from "~~/types/poll";

const VoteCard: FC<IPoll> = ({ pollId }) => {
  const { data } = useScaffoldReadContract({
    contractName: "VotingContract",
    functionName: "getPollDetails",
    args: [BigInt(pollId)],
  });

  const { writeContractAsync } = useScaffoldWriteContract({
    contractName: "VotingContract",
  });

  if (!data) return <p>Загрузка...</p>;

  const [question, options, , isActive] = data;
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg mb-4">
      <h3 className="text-xl font-semibold text-black">{question}</h3>
      <ul className="mt-2 mb-4">
        {options.map((opt: string, idx: number) => (
          <li key={idx} className="flex justify-between items-center">
            <span className="text-black">{opt}</span>
            {isActive && (
              <Button
                onClick={() =>
                  writeContractAsync({
                    functionName: "vote",
                    args: [BigInt(pollId), BigInt(idx)],
                  })
                }
                className="mb-2"
              >
                Голосовать
              </Button>
            )}
          </li>
        ))}
      </ul>
      {!isActive && <p className="text-red-500">Голосование завершено</p>}
      {isActive && <EntVote pollId={pollId} />}
      <UserVoted pollId={pollId} isActive={isActive} />
    </div>
  );
};

export default VoteCard;
