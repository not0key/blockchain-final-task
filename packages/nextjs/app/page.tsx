"use client";

import { useEffect, useState } from "react";
import CreateVote from "../components/CreateVote";
import PollList from "../components/VoteList";
import { NextPage } from "next";
import { useAccount } from "wagmi";
import ResultsVote from "~~/components/ResultsVote";

const Page: NextPage = () => {
  const { address, isConnected } = useAccount();
  const [activeSection, setActiveSection] = useState<"create" | "results" | "list">("create");

  useEffect(() => {
    if (isConnected) {
      console.log("Пользователь подключен: ", address);
    }
  }, [isConnected, address]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex">
        <nav className="w-1/4 bg-white rounded-lg shadow-md p-4">
          <ul className="space-y-4">
            <li>
              <button
                className={`w-full text-left p-2 rounded-lg ${
                  activeSection === "create" ? "bg-blue-500 text-white" : "bg-gray-100"
                }`}
                onClick={() => setActiveSection("create")}
              >
                Создать голосование
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left p-2 rounded-lg ${
                  activeSection === "list" ? "bg-blue-500 text-white" : "bg-gray-100"
                }`}
                onClick={() => setActiveSection("list")}
              >
                Список голосований
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left p-2 rounded-lg ${
                  activeSection === "results" ? "bg-blue-500 text-white" : "bg-gray-100"
                }`}
                onClick={() => setActiveSection("results")}
              >
                Результаты
              </button>
            </li>
          </ul>
        </nav>

        <div className="w-3/4 pl-5">
          {activeSection === "create" && <CreateVote />}
          {activeSection === "list" && <PollList />}
          {activeSection === "results" && <ResultsVote />}
        </div>
      </div>
    </div>
  );
};

export default Page;
