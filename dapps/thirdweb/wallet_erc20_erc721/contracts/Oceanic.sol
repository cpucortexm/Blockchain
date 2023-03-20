// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/base/ERC721Base.sol";

contract OceanicNFT is ERC721Base {
    uint256 public Id;
    //create a mapping that associates token IDs with owner addresses
    mapping(uint256 => address) private tokenOwners;

    constructor(
        string memory _name,
        string memory _symbol,
        address _royaltyRecipient,
        uint128 _royaltyBps
    ) ERC721Base(_name, _symbol, _royaltyRecipient, _royaltyBps) {}

    function createNFT(
        address _to,
        string calldata metadata
    ) external onlyOwner returns (uint256) {
        mintTo(_to, metadata); // only mint 1 NFT at a time
        Id = nextTokenIdToMint(); // get token Id of the minted token
        tokenOwners[Id] = _to;
        return Id;
    }

    function transferNFT(
        address sender,
        address receiver,
        uint256 tokenId,
        string calldata newMetadata
    ) external {
        safeTransferFrom(sender, receiver, tokenId);
        _setTokenURI(tokenId, newMetadata);
        tokenOwners[tokenId] = receiver; // update new token owner
    }
}
