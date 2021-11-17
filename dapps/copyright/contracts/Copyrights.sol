// SPDX-License-Identifier: GPL-3.0-or-later
/*-----------------------------------------------------------
 @Filename:         Copyrights.sol
 @Copyright Author: Yogesh K
 @Date:             14/11/2021
-------------------------------------------------------------*/
pragma  solidity ^0.8.9;

contract Copyright{

    event registeredContent(uint counter, bytes32 indexed hashID, string indexed contentURL,
                address indexed owner, uint timestamp, string email,
                string termsOfUse);

    struct Content {
        uint counter; // count of no of copyrighted elements added to the blockchain
        bytes32 hashid; // using keccak256 computes hash and returns in bytes32
        string contentURL; // the URL link to original document to be copyrighted
        address owner;  // owners address of this copyrighted material
        uint timestamp; // time when the content was copyrighted
        string email;  // email of the owner to provide it for the users to contact
        string termsOfUse; // a piece of text explaining how the content must be treated by the users
    }

    mapping(bytes32=> Content) public copyrightsbyId;
    address payable public owner;
    uint private counter = 0; // increment only when added or decrement when deleted

    constructor() {
        owner = payable(msg.sender);
    }

    modifier check_validity(bytes32 _hashid, string memory _content, 
                            string memory _email, string memory _termsofuse)
    {
        require(_hashid != 0 && bytes(_content).length !=0 &&
                bytes(_email).length !=0 && bytes(_termsofuse).length !=0,
                "Enter non zero params");
               
        _;
    }
    // add content that needs copyright
    function addContent(bytes32 _hashId, 
                        string memory _contentURL,
                        string memory _email,
                        string memory _termsOfUse
                        )public
                        check_validity(_hashId, _contentURL, _email, _termsOfUse)
    {
        counter += 1;
        Content memory newContent = Content(counter, _hashId, _contentURL, owner, block.timestamp, _email, _termsOfUse);
        copyrightsbyId[_hashId] = newContent;
        emit registeredContent(counter, _hashId, _contentURL, owner, block.timestamp, _email, _termsOfUse);
    }

    // delete content if you are the owner
    function deleteContentbyHash(bytes32 _hashId) public 
    {
        if(copyrightsbyId[_hashId].owner == msg.sender)
        {
            delete copyrightsbyId[_hashId];
        }
    }
    // to extract the funds locked in this account
    // PS:this refers to the instance of the contract where the call is made (you can have 
    // multiple instances of the same contract).
    // address(this) refers to the address of the instance of the contract where the call 
    // is being made.
    // msg.sender refers to the address where the contract is being called from.

    function extractFunds() public
    {
        owner.transfer(address(this).balance);
    }

}