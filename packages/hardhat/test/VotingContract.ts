import { ethers } from "hardhat";
import { expect } from "chai";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { VotingContract } from "../typechain-types";

describe("VotingContract Tests", function () {
  let votingInstance: VotingContract;
  let contractOwner: HardhatEthersSigner;
  let voter1: HardhatEthersSigner;
  let voter2: HardhatEthersSigner;

  const voteOptions = ["Option A", "Option B"];
  const voteDuration = 3600;

  beforeEach(async () => {
    const contractFactory = await ethers.getContractFactory("VotingContract");
    votingInstance = await contractFactory.deploy();
    await votingInstance.waitForDeployment();

    [contractOwner, voter1, voter2] = await ethers.getSigners();
  });

  const createPollAndRetrieveDetails = async (pollQuestion: string, options: string[], duration: number) => {
    await votingInstance.createPoll(pollQuestion, options, duration);
    return await votingInstance.getPollDetails(0);
  };

  const castVote = async (pollId: number, voter: HardhatEthersSigner, optionIndex: number) => {
    await votingInstance.connect(voter).vote(pollId, optionIndex);
    return await votingInstance.hasUserVoted(pollId, voter.address);
  };

  const closePollAndRetrieveDetails = async (pollId: number) => {
    await ethers.provider.send("evm_increaseTime", [2]);
    await ethers.provider.send("evm_mine", []);
    await votingInstance.endPoll(pollId);
    return await votingInstance.getPollDetails(pollId);
  };

  it("Should successfully create a poll", async () => {
    const pollQuestion = "What is your favorite color?";
    const pollDetails = await createPollAndRetrieveDetails(pollQuestion, voteOptions, voteDuration);

    expect(pollDetails.question).to.equal(pollQuestion);
    expect(pollDetails.options).to.deep.equal(voteOptions);
    expect(pollDetails.isActive).to.equal(true);
    expect(pollDetails.creator).to.equal(contractOwner.address);
  });

  it("Should reject poll creation with fewer than 2 options", async () => {
    await expect(votingInstance.createPoll("Test Question", ["Option A"], 3600)).to.be.revertedWith(
      "There must be at least two possible answers",
    );
  });

  it("Should allow users to vote and prevent duplicate voting", async () => {
    await createPollAndRetrieveDetails("Poll Question", voteOptions, voteDuration);

    const hasVoted1 = await castVote(0, voter1, 0);
    expect(hasVoted1).to.equal(true);

    await expect(votingInstance.connect(voter1).vote(0, 0)).to.be.revertedWith("You have already voted");
  });

  it("Should allow only the poll creator to close the poll", async () => {
    await createPollAndRetrieveDetails("Poll Question", voteOptions, 1);

    const pollAfterClosure = await closePollAndRetrieveDetails(0);
    expect(pollAfterClosure.isActive).to.equal(false);
  });

  it("Should not allow premature poll closure", async () => {
    await createPollAndRetrieveDetails("Poll Question", voteOptions, voteDuration);
    await expect(votingInstance.endPoll(0)).to.be.revertedWith("Voting is still active");
  });

  it("Should return correct results after poll closure", async () => {
    await createPollAndRetrieveDetails("Poll Question", voteOptions, voteDuration);
    await castVote(0, voter1, 0);
    await castVote(0, voter2, 1);

    await ethers.provider.send("evm_increaseTime", [voteDuration]);
    await ethers.provider.send("evm_mine", []);

    await votingInstance.endPoll(0);

    const pollResults = await votingInstance.getResults(0);
    expect(pollResults.voteCounts[0]).to.equal(1n);
    expect(pollResults.voteCounts[1]).to.equal(1n);
  });
});
