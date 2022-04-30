//SPDX-License-Identifier: MIT
/// @title NFT minting for artists ERC721 compliant
/// @author Yogesh K
/// @notice Use this contract for minting of art.
/// Token IDs will start from 1 and upto 100
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FinxterNFT is ERC721, Ownable {
    // =============================================================================
    //              Contract variables start here
    // =============================================================================
    using Strings for uint256; // uint256 variable can call up functions in the Strings library.e.g. value.toString()
    using Counters for Counters.Counter;

    Counters.Counter private _supply;

    string public uriPrefix = "";
    uint256 public cost = 0.01 ether; // cost of minting
    uint256 public maxSupply = 100; // 100 NFT
    uint256 public maxMintAmountPerTx = 5; // max allowed to mint per transaction
    mapping(address => bool) public whitelisted; // if you are whitelisted, you dont have to pay

    constructor(string memory _initBaseURI) ERC721("Finxter", "FT") {
        setUriPrefix(_initBaseURI);
    }

    modifier mintCompliance(uint256 _mintAmount) {
        require(
            _mintAmount > 0 && _mintAmount <= maxMintAmountPerTx,
            "Invalid mint amount!"
        );
        require(
            _supply.current() + _mintAmount <= maxSupply,
            "Max supply exceeded!"
        );
        _; // resume with function execution
    }

    function totalSupply() public view returns (uint256) {
        return _supply.current();
    }

    function mint(uint256 _mintAmount)
        public
        payable
        mintCompliance(_mintAmount)
    {
        if (msg.sender != owner()) {
            if (whitelisted[msg.sender] != true) {
                //general public
                require(msg.value >= cost * _mintAmount, "Insufficient funds!");
            }
        }
        _mintLoop(msg.sender, _mintAmount);
    }

    function walletOfOwner(address _owner)
        public
        view
        returns (uint256[] memory)
    {
        uint256 ownerTokenCount = balanceOf(_owner);
        uint256[] memory ownedTokenIds = new uint256[](ownerTokenCount);
        uint256 currentTokenId = 1;
        uint256 ownedTokenIndex = 0;

        while (
            ownedTokenIndex < ownerTokenCount && currentTokenId <= maxSupply
        ) {
            address currentTokenOwner = ownerOf(currentTokenId);

            if (currentTokenOwner == _owner) {
                ownedTokenIds[ownedTokenIndex] = currentTokenId;
                ownedTokenIndex++;
            }

            currentTokenId++;
        }

        return ownedTokenIds;
    }

    function setUriPrefix(string memory _uriPrefix) public onlyOwner {
        uriPrefix = _uriPrefix;
    }

    function withdraw() public onlyOwner {
        (bool os, ) = payable(owner()).call{value: address(this).balance}("");
        require(os, "Failed to withdraw amount!");
    }

    function _mintLoop(address _receiver, uint256 _mintAmount) internal {
        for (uint256 i = 0; i < _mintAmount; i++) {
            _supply.increment();
            _safeMint(_receiver, _supply.current());
        }
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}
}
