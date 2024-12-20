import VoteCard from "./VoteCard";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const PollList = () => {
  const { data: pollCount } = useScaffoldReadContract({
    contractName: "VotingContract",
    functionName: "getPollCount",
  });

  const renderPolls = () => {
    if (!pollCount) return <p>Загрузка...</p>;
    const polls = [];
    for (let i: number = 0; i < pollCount; i++) {
      polls.push(<VoteCard key={i} pollId={BigInt(i)} />);
    }
    return polls;
  };

  return (
    <div className="p-6 bg-white from-purple-500 to-pink-500 text-black rounded-lg shadow-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Список голосований</h2>
      {pollCount && pollCount > 0 ? renderPolls() : <p className="text-xl">Нет активных голосований</p>}
    </div>
  );
};

export default PollList;
