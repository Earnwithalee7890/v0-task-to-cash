// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TrueScoreCheckIn is Ownable, ReentrancyGuard {
    // Fee in Wei: 0.000001 ETH
    uint256 public checkInFee = 1000 gwei;

    // Reward: 0.005 USDC (USDC has 6 decimals)
    IERC20 public usdcToken;
    uint256 public rewardAmount = 5000; 

    address constant BASE_USDC = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;
    uint256 public constant COOLDOWN_PERIOD = 24 hours;

    struct UserStats {
        uint256 totalCheckIns;
        uint256 lastCheckInTime;
        uint256 claimableReward; // The reward waiting to be claimed
    }

    mapping(address => UserStats) public users;
    uint256 public totalCheckInsGlobal;

    event CheckedIn(address indexed user, uint256 timestamp, uint256 feePaid);
    event RewardClaimed(address indexed user, uint256 amount);
    event FeeUpdated(uint256 newFee);
    event RewardUpdated(uint256 newReward);
    event FundsWithdrawn(address indexed to, uint256 amount);
    event TokensWithdrawn(address indexed token, address indexed to, uint256 amount);

    constructor(address initialOwner) Ownable(initialOwner) {
        usdcToken = IERC20(BASE_USDC);
    }

    /**
     * @dev CHECK IN
     * - User pays 0.000001 ETH fee to YOU.
     * - Reward resets to 0.005 USDC. 
     * - Logic: "Use it or Lose it". If they had 0.005 unclaimed, it stays 0.005 (doesn't become 0.01).
     */
    function checkIn() external payable nonReentrant {
        require(msg.value >= checkInFee, "Insufficient check-in fee");
        
        UserStats storage user = users[msg.sender];
        require(block.timestamp >= user.lastCheckInTime + COOLDOWN_PERIOD, "Cooldown active: wait 24h");

        // Fees go to contract balance automatically.

        // UPDATE STATE
        user.totalCheckIns += 1;
        user.lastCheckInTime = block.timestamp;
        
        // RESET REWARD for this cycle
        // This ensures it never goes above 0.005 USDC
        user.claimableReward = rewardAmount; 
        
        totalCheckInsGlobal += 1;

        emit CheckedIn(msg.sender, block.timestamp, msg.value);
    }

    /**
     * @dev CLAIM REWARD
     * - User calls this to get their 0.005 USDC.
     */
    function claimReward() external nonReentrant {
        UserStats storage user = users[msg.sender];
        uint256 amount = user.claimableReward;

        require(amount > 0, "No reward to claim");
        require(usdcToken.balanceOf(address(this)) >= amount, "Contract empty (contact admin)");

        // ZERO OUT balance before transfer
        user.claimableReward = 0;

        bool success = usdcToken.transfer(msg.sender, amount);
        require(success, "Transfer failed");

        emit RewardClaimed(msg.sender, amount);
    }

    // --- ADMIN FUNCTIONS ---

    function setCheckInFee(uint256 _newFee) external onlyOwner {
        checkInFee = _newFee;
        emit FeeUpdated(_newFee);
    }

    function setRewardAmount(uint256 _newReward) external onlyOwner {
        rewardAmount = _newReward;
        emit RewardUpdated(_newReward);
    }

    function withdrawDocs() external onlyOwner {
        uint256 balance = address(this).balance;
        payable(owner()).transfer(balance);
        emit FundsWithdrawn(owner(), balance);
    }

    function withdrawTokens(address _token) external onlyOwner {
        uint256 balance = IERC20(_token).balanceOf(address(this));
        IERC20(_token).transfer(owner(), balance);
        emit TokensWithdrawn(_token, owner(), balance);
    }

    // --- VIEW ---

    function getUserStats(address _user) external view returns (
        uint256 totalCheckIns, 
        uint256 lastCheckInTime, 
        uint256 nextCheckInTime,
        uint256 claimableReward
    ) {
        UserStats memory user = users[_user];
        return (
            user.totalCheckIns, 
            user.lastCheckInTime, 
            user.lastCheckInTime + COOLDOWN_PERIOD,
            user.claimableReward
        );
    }
}
