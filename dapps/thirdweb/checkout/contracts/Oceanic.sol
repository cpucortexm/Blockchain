// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/base/ERC721Base.sol";

contract OceanicNFT is ERC721Base {
    event NFTCreated(uint256 nftId);
    uint256 public Id;
    //create a mapping that associates token IDs with owner addresses
    mapping(address => uint256[]) private tokenOwners;

    //mapping(uint256 => address) private tokenOwners;

    constructor(
        string memory _name,
        string memory _symbol,
        address _royaltyRecipient,
        uint128 _royaltyBps
    ) ERC721Base(_name, _symbol, _royaltyRecipient, _royaltyBps) {}

    function createNFT(
        address _to,
        string calldata metadata
    ) external onlyOwner {
        Id = nextTokenIdToMint(); // get token Id of the current minted token
        mintTo(_to, metadata); // only mint 1 NFT at a time
        tokenOwners[_to].push(Id);
        emit NFTCreated(Id);
    }

    function transferNFT(
        address sender,
        address receiver,
        uint256 tokenId,
        string calldata newMetadata
    ) external {
        safeTransferFrom(sender, receiver, tokenId);
        _setTokenURI(tokenId, newMetadata);
        tokenOwners[receiver].push(tokenId); // update new token owner
        removeTokenOwner(sender, tokenId);
    }

    function removeTokenOwner(address _owner, uint256 _tokenId) public {
        uint256[] storage tokenIds = tokenOwners[_owner];
        for (uint256 i = 0; i < tokenIds.length; i++) {
            if (tokenIds[i] == _tokenId) {
                // Found the token ID at index i, remove it from the array
                tokenIds[i] = tokenIds[tokenIds.length - 1];
                tokenIds.pop();
                break;
            }
        }
    }

    function getTokenOwners(
        address _owner
    ) public view returns (uint256[] memory) {
        return tokenOwners[_owner];
    }
}
