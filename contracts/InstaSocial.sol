// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract InstaSocial is Ownable, ReentrancyGuard {

    uint256 public balance;

    event PostCreated(address indexed user, string content, uint256 timestamp);
    event PostLiked(address indexed user, uint256 postId, uint256 timestamp);

    struct Post {
        address user;
        string content;
        uint256 timestamp;
        uint256 likes;
    }

    Post[] public posts;

    constructor() Ownable(msg.sender) {
        balance = 0;
    }


    function getBalance() public view returns (uint256) {
        return balance;
    }

    function createPost(string memory content) public  {
        posts.push(Post({ user: msg.sender, content: content, timestamp: block.timestamp, likes: 0 }));
        emit PostCreated(msg.sender, content, block.timestamp);
    }

    function likePost(uint256 postId) public {
        require(postId < posts.length, "Post does not exist");
        posts[postId].likes += 1; // Direct addition is safe in newer Solidity versions
        emit PostLiked(msg.sender, postId, block.timestamp);
    }

    function getPosts() public view returns (Post[] memory) {
        return posts;
    }
}
