// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "@openzeppelin/contracts/access/Ownable.sol";

contract PostFactory is Ownable {
    uint256 public postCounter;

    mapping(address => Post) public posts;
    mapping(uint256 => address) public postOwners;

    struct Post {
        string description;
        uint256 id;
        address owner;
    }

    event CreatedPost(string description, uint256 id, address owner);

    function createPost(string memory _description) public {
        require(
            keccak256(abi.encodePacked(_description)) != "",
            "Please enter a valid description"
        );

        postCounter++;
        posts[msg.sender] = Post(_description, postCounter, msg.sender);
        emit CreatedPost(_description, postCounter, msg.sender);
    }
}
