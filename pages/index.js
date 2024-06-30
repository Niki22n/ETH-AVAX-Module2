import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import InstaSocialABI from "../artifacts/contracts/InstaSocial.sol/InstaSocial.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [instaSocialContract, setInstaSocialContract] = useState(undefined);
  const [message, setMessage] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [postLikes, setPostLikes] = useState({});
  const [balance, setBalance] = useState(0);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with your deployed contract address
  const instaSocialABI = InstaSocialABI.abi;

  useEffect(() => {
    getWallet();
  }, []);

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          handleAccount(accounts[0]);
        }
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      console.error("MetaMask is not installed");
    }
  };

  const handleAccount = (account) => {
    setAccount(account);
    getContract(account);
  };

  const getContract = async (account) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, instaSocialABI, signer);
    setInstaSocialContract(contract);
    getPosts();
    getBalance();
  };

  const handleCreatePost = async () => {
    if (instaSocialContract && newPostContent !== "") {
      try {
        await instaSocialContract.createPost(newPostContent);
        setMessage("Post created successfully!");
        setNewPostContent("");
        getPosts();
      } catch (error) {
        console.error("Error creating post:", error);
        setMessage("Error creating post.");
      }
    } else {
      setMessage("Please enter content for the post.");
    }
  };

  const handleLikePost = async (postId) => {
    if (instaSocialContract) {
      try {
        await instaSocialContract.likePost(postId);
        setMessage("Post liked successfully!");
        getPosts();
      } catch (error) {
        console.error("Error liking post:", error);
        setMessage("Error liking post.");
      }
    }
  };

  const getPosts = async () => {
    if (instaSocialContract) {
      try {
        const posts = await instaSocialContract.getPosts();
        console.log("Posts from contract:", posts);
  
        // Update posts state
        setPosts(posts);
  
        // Update likes for each post
        const likes = {};
        for (let i = 0; i < posts.length; i++) {
          const postId = posts[i]?.id?.toNumber(); // Safely access id
          if (postId !== undefined) {
            const postLikes = await instaSocialContract.getLikes(postId);
            likes[postId] = postLikes.toNumber();
          }
        }
        setPostLikes(likes);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    }
  };

  const initUser = () => {
    if (!ethWallet) {
      return <p>Please install MetaMask Wallet to use.</p>;
    }

    if (!account) {
      return (
        <button onClick={connectAccount}>Connect MetaMask</button>
      );
    }

    return (
      <div>
        <textarea
          display={"flex"}
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="Enter your content here..."
        />
        <div>
          <button display={"flex"} onClick={handleCreatePost}>
            Create Post
          </button>
          <button display={"flex"} onClick={() => handleLikePost(0)}>
            Like Post
          </button>
        </div>
        {message && <p>{message}</p>}
      </div>
    );
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    try {
      const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
      handleAccount(accounts[0]);
    } catch (error) {
      console.error("Error connecting account: " + (error.message || error));
    }
  };

  const getBalance = async () => {
    if (instaSocialContract && account) {
      try {
        const balance = await socialVerseContract.balanceOf(account);
        setBalance(ethers.utils.formatEther(balance)); // Format balance as a readable number
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    }
  };

  return (
    <main className="container">
      <div className="box">
        <header>
          <h1>InstaSocial</h1>
          <h3>An App to help you post your stories</h3>
        </header>
        {initUser()}
      </div>
      <style jsx>{`
        .box {
          border: solid 1px white;
          padding: 50px;
          background: #cdb4db;
        }
        .container {
          text-align: center;
          background-size: cover;
          background-position: center;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: #333;
          font-family: "Arial", sans-serif;
          background: rgb(205, 180, 219);
          background: linear-gradient(
            90deg,
            rgba(205, 180, 219, 1) 0%,
            rgba(255, 200, 221, 1) 28%,
            rgba(255, 175, 204, 1) 51%,
            rgba(189, 224, 254, 1) 84%,
            rgba(162, 210, 255, 1) 100%
          );
          padding: 20px;
        }

        header h1 {
          font-size: 3rem;
          font-weight: bold;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
          margin-bottom: 20px;
          color: #333;
        }

        textarea {
          width: 100%;
          height: 100px;
          margin-bottom: 10px;
          padding: 20px;
          font-size: 1rem;
          border: 1px solid #ccc;
          border-radius: 8px;
          resize: vertical;
        }

        input[type="number"] {
          width: 100px;
          margin-right: 10px;
          padding: 8px;
          font-size: 1rem;
          border: 1px solid #ccc;
          border-radius: 8px;
        }

        button {
          padding: 15px 30px;
          font-size: 18px;
          color: #fff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s ease, transform 0.3s ease;
          max-width: 300px;
          width: 100%;

          /* Gradient background */
          background-image: linear-gradient(45deg, #6a11cb 0%, #2575fc 100%);

          /* Box shadow for depth */
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

          /* Text shadow for readability */
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
        }

        button:hover {
          background-color: #0056b3;
          transform: scale(1.05);
          background-image: linear-gradient(45deg, #2575fc 0%, #6a11cb 100%);
        }

        p {
          margin: 10px 0;
          font-size: 1.2rem;
          line-height: 1.6;
          color: #333;
          background-color: rgba(255, 255, 255, 0.7);
          padding: 10px 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </main>
  );
}
