// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract PostFactory is Ownable, ERC721URIStorage {
    uint256 public postCounter;
    uint256 public tokenCount;

    mapping(uint256 => Post) public posts;
    mapping(address => uint256) public postOwners;
    mapping(uint256 => ProcfileNft) public profile;

    struct Post {
        string description;
        uint256 id;
        address owner;
    }

    struct ProcfileNft {
        address payable owner;
        uint256 id;
        uint256 price;
    }

    event CreatedPost(string description, uint256 id, address owner);
    event UpdatedPost(uint256 id, string udpatedDescription);
    event DeletedPost(uint256 id, string);
    event MintedNFT(uint256 tokenId, address owner);
    event TransferNFT(address _seller, address _buyer, uint256 price);

    constructor() ERC721("Decentrablog", "DCB") {}

    function mint(string memory _tokenURI, uint256 _price)
        external
        returns (bool)
    {
        tokenCount++;
        ProcfileNft memory _nft;
        _nft.price = _price;
        _safeMint(msg.sender, tokenCount);
        _setTokenURI(tokenCount, _tokenURI);
        setProfile(tokenCount, _price);
        emit MintedNFT(tokenCount, msg.sender);
        return true;
    }

    function setProfile(uint256 _id, uint256 _price) public {
        require(
            ownerOf(_id) == msg.sender,
            "Must own the nft you want to select as your profile"
        );

        postOwners[msg.sender] = _id;
        uint256 id = postOwners[msg.sender];
        profile[id] = ProcfileNft(payable(msg.sender), id, _price);
    }

    function getPostAll() public view returns (Post[] memory _posts) {
        _posts = new Post[](postCounter);
        for (uint256 i = 0; i < _posts.length; i++) {
            _posts[i] = posts[i + 1];
        }
    }

    function getAllNfts() external view returns (ProcfileNft[] memory _nfts) {
        _nfts = new ProcfileNft[](tokenCount);

        for (uint256 i = 0; i < _nfts.length; i++) {
            _nfts[i] = profile[i + 1];
        }
    }

    function createPost(string memory _description) public {
        require(
            keccak256(abi.encodePacked(_description)) !=
                keccak256(abi.encodePacked("")),
            "Please enter a valid description"
        );

        postCounter++;
        posts[postCounter] = Post(_description, postCounter, msg.sender);
        emit CreatedPost(_description, postCounter, msg.sender);
    }

    function updatePost(uint256 _id, string memory _description)
        public
        onlyOwner
    {
        require(
            keccak256(abi.encodePacked(_description)) !=
                keccak256(abi.encodePacked("")),
            "Please enter a valid description"
        );
        uint256 postId = _findPost(_id);
        Post storage updatedPost = posts[postId];
        updatedPost.description = _description;
        emit UpdatedPost(postId, _description);
    }

    function deletePost(uint256 _id) public {
        uint256 postToDelete = _findPost(_id);
        delete posts[postToDelete];
        emit DeletedPost(_id, "Deleted successfully");
    }

    function _findPost(uint256 _id) private view returns (uint256) {
        Post memory post = posts[_id];

        if (post.id == _id) {
            return post.id;
        }
        revert("Not found");
    }
}
