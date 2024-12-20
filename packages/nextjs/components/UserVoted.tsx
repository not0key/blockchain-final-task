import { FC, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { IPoll } from "~~/types/poll";

interface IHasUserVoted extends IPoll {
  isActive: boolean;
}

const UserVoted: FC<IHasUserVoted> = ({ pollId, isActive }) => {
  const [userAddress, setUserAddress] = useState<string>("");

  const { data: hasVoted } = useScaffoldReadContract({
    contractName: "VotingContract",
    functionName: "hasUserVoted",
    args: [pollId, userAddress],
  });

  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (isConnected && address) {
      setUserAddress(address);
    }
  }, [isConnected, address]);

  if (hasVoted === undefined) return <p>Загрузка...</p>;

  return (
    <>
      {isActive && (
        <div className="p-4 bg-blue-500 text-white rounded-lg shadow-md mt-4">
          {hasVoted ? (
            <p className="text-xl font-semibold">Ваш голос уже учтён в этом голосовании.</p>
          ) : (
            <p className="text-xl font-semibold">Вы ещё не приняли участие в этом голосовании.</p>
          )}
        </div>
      )}
    </>
  );
};

export default UserVoted;
