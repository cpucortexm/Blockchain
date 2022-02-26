//SPDX-License-Identifier: Unlicense
/*-----------------------------------------------------------
 @Filename:         simpleDeed.sol
 @Copyright Author: Yogesh K
 @Date:             26/02/2022
-------------------------------------------------------------*/
pragma solidity ^0.8.9;

// withdraw can be executed by the lawyer only
// deed contract is used for transfers property to another owner
// of family (e.g. gift deed)

contract simpleDeed {
    address public lawyer;
    address payable public beneficiary;
    uint256 public fromNow;

    constructor(address _lawyer,
                address payable _beneficiary,
                uint256 _fromNow) payable
    {
        lawyer = _lawyer;
        beneficiary = _beneficiary;
        fromNow   = block.timestamp + _fromNow;  // i.e. from now + time
    }

    // send the money to the beneficiary
    // can be executed only by the lawyer
    function withdraw() public payable {
        // Call returns a boolean value indicating success or failure.
        require(block.timestamp >=fromNow, "Too early to withdraw!");
        require(msg.sender == lawyer, "Only Lawyer!");
        (bool sent, ) = beneficiary.call{value: address(this).balance}("");
        require(sent, "Failed to send Ether");
    }
}
