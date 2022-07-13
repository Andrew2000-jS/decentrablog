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
    event UpdatedPost(address owner, string udpatedDescription);
    event DeletedPost(uint256 id, string);

    function createPost(string memory _description) public {
        require(
            keccak256(abi.encodePacked(_description)) != "",
            "Please enter a valid description"
        );

        postCounter++;
        posts[msg.sender] = Post(_description, postCounter, msg.sender);
        postOwners[postCounter] = msg.sender;
        emit CreatedPost(_description, postCounter, msg.sender);
    }

    function updatePost(uint256 _id, string memory _description)
        public
        onlyOwner
    {
        address ownerFound = _findOwner(_id);
        Post storage updatedPost = posts[ownerFound];
        updatedPost.description = _description;

        emit UpdatedPost(ownerFound, _description);
    }

    function deletePost(uint256 _id) public {
        address postToDelete = _findOwner(_id);
        delete posts[postToDelete];

        emit DeletedPost(_id, "Deleted successfully");
    }

    function _findOwner(uint256 _id) private view returns (address) {
        address ownerAddress = postOwners[_id];
        if (ownerAddress != msg.sender && ownerAddress == address(0x0)) {
            revert("Not found");
        }

        return ownerAddress;
    }
}
