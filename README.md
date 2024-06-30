# ETH-Module-2-Intermediate

We will create a InstaSocial smart contract which has functions like Create Post and Like Post.

## Prerequisits
solidity ^0.8.26

## Code
```js

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
        paused = false;
    }

    function getBalance() public view returns (uint256) {
        return balance;
    }
    function createPost(string memory content) public whenNotPaused {
        posts.push(Post({ user: msg.sender, content: content, timestamp: block.timestamp, likes: 0 }));
        emit PostCreated(msg.sender, content, block.timestamp);
    }

    function likePost(uint256 postId) public whenNotPaused {
        require(postId < posts.length, "Post does not exist");
        posts[postId].likes += 1; // Direct addition is safe in newer Solidity versions
        emit PostLiked(msg.sender, postId, block.timestamp);
    }

    function getPosts() public view returns (Post[] memory) {
        return posts;
    }
}

```
After creating this file we will have to deploy it using hardhat so we follow the following instructions:

1. npm i
2. npx hardhat node
3. npx hardhat run --network localhost scripts/deploy.js
5. npm run dev 

After this, the project will be running on your localhost. 
Typically at http://localhost:3000/

## Liscence
MIT


## Author 
Nikita 
