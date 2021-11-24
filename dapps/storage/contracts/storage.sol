// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/**
 * @title Storage
 * @dev Store & retrieve value in a variable
 */
contract Storage {

    string name;

    /**
     * @dev Store value in variable
     * @param _name value to store
     */
    function store(string memory _name) public {
        name = _name;
    }

    /**
     * @dev Return value 
     * @return value of 'number'
     */
    function retrieve() public view returns (string memory){
        return name;
    }
}