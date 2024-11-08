// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.2;

contract Project {
    address public creator;
    string public description;
    uint256 public goalAmount;
    uint256 public currentAmount;
    uint256 public deadline;
    enum ProjectStatus {
        Ongoing,
        Successful,
        Failed
    }
    ProjectStatus public status;
    struct Dunation {
        address dunor;
        uint256 amount;
    }
    Dunation[] public dunations;

    event DunationReceived(address indexed dunor, uint256 amount);
    event ProjectStatusChange(ProjectStatus status);
    event FundWithDraw(address indexed creator, uint256 amount);
    event FundRefund(address indexed dunor, uint256 amount);

    modifier onlyCreator() {
        require(msg.sender == creator, "Not the project creator");
        _;
    }
    modifier onlyAfterDeadline() {
        require(block.timestamp >= deadline);
        _;
    }

    function initialize(
        address _creator,
        string memory _description,
        uint256 _goalAmount,
        uint256 _duration
    ) public {
        creator = _creator;
        goalAmount = _goalAmount;
        description = _description;
        deadline = block.timestamp + _duration;
        status = ProjectStatus.Ongoing;
    }

    function donate() external payable {
        require(status == ProjectStatus.Ongoing);
        require(block.timestamp < deadline);
        dunations.push(Dunation({dunor: msg.sender, amount: msg.value}));
        currentAmount = currentAmount += msg.value;
        emit DunationReceived(msg.sender, msg.value);
    }

    function withdrawFunds() external onlyAfterDeadline onlyCreator {
        require(status == ProjectStatus.Successful);
        uint256 amount = address(this).balance;
        payable(creator).transfer(amount);
        emit FundWithDraw(creator, amount);
    }

    function refundFund() external onlyAfterDeadline {
        require(status == ProjectStatus.Failed);
        uint256 totalRefund = 0;
        for (uint i = 0; i < dunations.length; i++) {
            if (dunations[i].dunor == msg.sender) {
                totalRefund += dunations[i].amount;
            }
        }
        require(totalRefund > 0);
        payable(msg.sender).transfer(totalRefund);
        emit FundRefund(msg.sender, totalRefund);
    }

    function updateProjectState() external onlyAfterDeadline onlyCreator {
        require(status == ProjectStatus.Ongoing);
        if (currentAmount >= goalAmount) {
            status = ProjectStatus.Successful;
        } else {
            status = ProjectStatus.Failed;
        }
        emit ProjectStatusChange(status);
    }

    constructor() {}
}
