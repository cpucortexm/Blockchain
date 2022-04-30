//SPDX-License-Identifier: MIT
/// @title NFT minting for artists ERC721 compliant
/// @author Yogesh K
/// @notice Use this contract for DAO to buy from fake NFT market

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * Interface for the FakeNFTMarketplace
 */
interface IPseudoNFTMarket {
    /// @dev getPrice() returns the price of an NFT from the FakeNFTMarketplace
    /// @return Returns the price in Wei for an NFT
    function getPrice() external view returns (uint256);

    /// @dev available() returns whether or not the given _tokenId has already been purchased
    /// @return Returns a boolean value - true if available, false if not
    function available(uint256 _tokenId) external view returns (bool);

    /// @dev purchase() purchases an NFT from the FakeNFTMarketplace
    /// @param _tokenId - the fake NFT tokenID to purchase
    function buy(uint256 _tokenId) external payable;
}

/**
 * Minimal interface for CryptoDevsNFT containing only two functions
 * that we are interested in
 */
interface IFinxterNFT {
    /// @dev walletOfOwner() returns the token IDs for a given owner
    /// @return IDs of token as an array
    function walletOfOwner(address _addr)
        external
        view
        returns (uint256[] memory);
}

contract FinxterDAO is Ownable {
    IPseudoNFTMarket nftMarketplace;
    IFinxterNFT finxterNFT;
    // Create a struct named Proposal containing all relevant information
    struct Proposal {
        // nftTokenId - the tokenID of the NFT to purchase from PseudoNFTMarket if the proposal passes
        uint256 nftTokenId;
        // deadline - the UNIX timestamp until which this proposal is active. Proposal can be executed after the deadline has been exceeded.
        uint256 deadline;
        // yayVotes - number of yay votes for this proposal
        uint256 yayVotes;
        // nayVotes - number of nay votes for this proposal
        uint256 nayVotes;
        // executed - whether or not this proposal has been executed yet. Cannot be executed before the deadline has been exceeded.
        bool executed;
        // voters - a mapping of Finxter tokenIDs to booleans indicating whether that NFT has already been used to cast a vote or not
        mapping(uint256 => bool) voters;
    }

    // Create an enum named Vote containing possible options for a vote
    enum Vote {
        YAY,
        NAY
    }
    // Create a mapping of ID to Proposal
    mapping(uint256 => Proposal) public proposals;
    // Number of proposals that have been created
    uint256 public numProposals;

    // Create a modifier which only allows a function to be
    // called by someone who owns at least 1 finxterNFT token
    // walletofOwner gives the token Ids and it must be > 0
    modifier nftHolderOnly() {
        uint256[] memory nfttokens = finxterNFT.walletOfOwner(msg.sender);
        require(nfttokens.length > 0, "NOT_A_DAO_MEMBER");
        _;
    }

    // Create a modifier which only allows a function to be
    // called if the given proposal's deadline has not been exceeded yet
    // You must vote before the deadline
    modifier activeProposalOnly(uint256 proposalIndex) {
        require(
            proposals[proposalIndex].deadline > block.timestamp,
            "DEADLINE_EXCEEDED"
        );
        _;
    }

    // Create a modifier which only allows a function to be
    // called if the given proposals' deadline HAS been exceeded
    // and if the proposal has not yet been executed
    // Basically you can execute only after a certain deadline
    modifier inactiveProposalOnly(uint256 proposalIndex) {
        require(
            proposals[proposalIndex].deadline <= block.timestamp,
            "DEADLINE_NOT_EXCEEDED"
        );
        require(
            proposals[proposalIndex].executed == false,
            "PROPOSAL_ALREADY_EXECUTED"
        );
        _;
    }

    // Create a payable constructor which initializes the contract
    // instances for PseudoNFTMarket and finxterNFT
    // The payable allows this constructor to accept an ETH deposit when it is being deployed
    constructor(address _nftMarketplace, address _finxterNFT) payable {
        nftMarketplace = IPseudoNFTMarket(_nftMarketplace); // instance of pseudoNFT marketplace
        finxterNFT = IFinxterNFT(_finxterNFT); // instance of Finxter NFT contract
    }

    /// @dev createProposal allows a FinxterNFT holder to create a new proposal in the DAO
    /// @param _nftTokenId - the tokenID of the NFT to be purchased from PseudoNFTMarketplace if this proposal passes
    /// @return Returns the proposal index for the newly created proposal
    function createProposal(uint256 _nftTokenId)
        external
        nftHolderOnly
        returns (uint256)
    {
        require(nftMarketplace.available(_nftTokenId), "NFT_NOT_FOR_SALE");
        Proposal storage proposal = proposals[numProposals];
        proposal.nftTokenId = _nftTokenId;
        // Set the proposal's voting deadline to be (current time + 5 minutes)
        proposal.deadline = block.timestamp + 5 minutes;

        numProposals++;

        return numProposals - 1;
    }

    /// @dev voteOnProposal allows a FinxterNFT holder to cast their vote on an active proposal
    /// @param proposalIndex - the index of the proposal to vote on in the proposals array
    /// @param vote - the type of vote they want to cast
    function voteOnProposal(uint256 proposalIndex, Vote vote)
        external
        nftHolderOnly
        activeProposalOnly(proposalIndex)
    {
        Proposal storage proposal = proposals[proposalIndex];

        // get list of token Ids owned by the msg.sender
        uint256[] memory nfttokens = finxterNFT.walletOfOwner(msg.sender);
        uint256 numVotes = 0;

        // Calculate how many NFTs are owned by the voter
        // that haven't already been used for voting on this proposal
        for (uint256 i = 0; i < nfttokens.length; i++) {
            uint256 tokenId = nfttokens[i];
            if (proposal.voters[tokenId] == false) {
                numVotes++;
                proposal.voters[tokenId] = true;
                break;
            }
        }
        require(numVotes > 0, "ALREADY_VOTED"); // if it is = 0, all nfts have been used for voting

        if (vote == Vote.YAY) {
            proposal.yayVotes += numVotes;
        } else {
            proposal.nayVotes += numVotes;
        }
    }

    /// @dev executeProposal allows any FinxterNFT holder to execute a proposal after it's deadline has been exceeded
    /// @param proposalIndex - the index of the proposal to execute in the proposals array
    function executeProposal(uint256 proposalIndex)
        external
        nftHolderOnly
        inactiveProposalOnly(proposalIndex)
    {
        Proposal storage proposal = proposals[proposalIndex];

        // If the proposal has more YAY votes than NAY votes
        // purchase the NFT from the PseudoNFTMarketplace
        if (proposal.yayVotes > proposal.nayVotes) {
            uint256 nftPrice = nftMarketplace.getPrice();
            require(address(this).balance >= nftPrice, "NOT_ENOUGH_FUNDS");
            nftMarketplace.buy{value: nftPrice}(proposal.nftTokenId);
            proposal.executed = true;
        }
    }

    /// @dev withdrawEther allows the contract owner (deployer) to withdraw the ETH from the contract
    function withdrawEther() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    // The following two functions allow the contract to accept ETH deposits
    // directly from a wallet without calling a function
    receive() external payable {}

    fallback() external payable {}
}
