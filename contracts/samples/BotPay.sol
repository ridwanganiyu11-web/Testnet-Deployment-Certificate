// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title BotPay
 * @dev Sample smart contract referenced in the DeployProof specification.
 * A lightweight decentralized payment checkout contract for Botchain Testnet (Chain ID 968).
 */
contract BotPay {
    address public owner;
    uint256 public totalPayments;

    event PaymentReceived(address indexed payer, uint256 amount, string orderId);
    event FundsWithdrawn(address indexed owner, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Pay BOT native tokens for an order.
     * @param orderId External order identifier.
     */
    function pay(string calldata orderId) external payable {
        require(msg.value > 0, "Payment amount must be greater than zero");
        totalPayments += msg.value;
        emit PaymentReceived(msg.sender, msg.value, orderId);
    }

    /**
     * @notice Withdraw collected native BOT funds to the owner.
     */
    function withdraw() external {
        require(msg.sender == owner, "Only owner can withdraw");
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = payable(owner).call{value: balance}("");
        require(success, "Withdrawal transfer failed");
        
        emit FundsWithdrawn(owner, balance);
    }
}

