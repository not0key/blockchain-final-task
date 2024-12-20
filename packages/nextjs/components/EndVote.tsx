import { FC } from "react";
import Button from "./ui/Button";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { IPoll } from "~~/types/poll";

const EntVote: FC<IPoll> = ({ pollId }) => {
  const { writeContractAsync, isMining } = useScaffoldWriteContract({
    contractName: "VotingContract",
  });

  const handleEndPoll = async () => {
    try {
      await writeContractAsync({
        functionName: "endPoll",
        args: [pollId],
      });
      alert("Голосование завершено!");
    } catch (error) {
      console.error(error);
      alert("Ошибка при завершении голосования.");
    }
  };

  return (
    <div className="p-4 bg-red-500 text-white rounded-lg shadow-md mt-4">
      <h3 className="text-xl font-bold">Завершить голосование</h3>
      <p>Вы уверены, что хотите завершить голосование?</p>
      <Button
        onClick={handleEndPoll}
        isLoading={isMining}
        loadingText="Завершение..."
        className="mt-4 px-6 py-2 rounded-lg bg-red-700 hover:bg-red-800"
      >
        Завершить
      </Button>
    </div>
  );
};

export default EntVote;
