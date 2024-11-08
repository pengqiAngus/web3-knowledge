// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.2;
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./Project.sol";
contract CrowdfundingPlatform {
    
    address[] public projects;

    event CreateProject(address project ,address creator, string description, uint256 goalAmount, uint256 dealine);
    constructor() {
        
    }
    function  initialize() public{
        Ownable_init(initialOwner);
        __UUPSUpgradeable_init();
    }
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    function  createProject( string memory _description, uint256 _amount, uint256 _duration ) public{
        Project newProject = new Project();
        newProject.initialize(msg.sender,_description, _goalAmount, _duration);
        projects.push(address(newProject));
        emit ProjectCreated(address(newProject), msg.sender, _description, _goalAmount, block.timestamp + _duration);

    }
    function  getProjects() public view returns (address[] memory) {
         return projects;
    }
}