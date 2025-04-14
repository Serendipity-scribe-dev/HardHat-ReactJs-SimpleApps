import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import contractData from "./Mycontract.json";
import 'bootstrap/dist/css/bootstrap.min.css';

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

function App() {
  const [message, setMessage] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [ethBalance, setEthBalance] = useState("0");
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [status, setStatus] = useState("");
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [userAddress, setUserAddress] = useState("");
  const maxLength = 100;



  useEffect(() => {
    async function init() {
      if (!window.ethereum) {
        alert("MetaMask not detected. Please install it.");
        return;
      }

      try {
        const tempProvider = new ethers.BrowserProvider(window.ethereum);
        await tempProvider.send("eth_requestAccounts", []);
        const tempSigner = await tempProvider.getSigner();
        const tempContract = new ethers.Contract(contractAddress, contractData.abi, tempSigner);
        const address = await tempSigner.getAddress();

        setProvider(tempProvider);
        setSigner(tempSigner);
        setContract(tempContract);
        setUserAddress(address);


        // Fetch initial data
        fetchMessage(tempContract);
        fetchBalance(tempSigner);

        // Detect account changes
        window.ethereum.on("accountsChanged", async () => {
          setSigner(null);
          setContract(null);
          init();

          
        });

      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    }

    init();
  }, []);

  async function fetchMessage(tempContract) {
    try {
      const fetchedMessage = await tempContract.message();
      setMessage(fetchedMessage);
    } catch (error) {
      console.error("Error fetching message:", error);
    }
  }

    // ✅ Fix: use useCallback to prevent re-renders
    const fetchBalance = useCallback(async (signer, provider) => {
      if (!signer || !provider) return;
      const balance = await provider.getBalance(await signer.getAddress());
      setEthBalance(ethers.formatEther(balance));
    }, []);

  async function updateMessage() {
    if (!contract) {
      alert("Contract is not loaded yet. Please connect MetaMask.");
      return;
    }

    try {
      setStatus("Updating message...");
      const tx = await contract.updateMessage(newMessage);
      await tx.wait();
      setMessage(await contract.message());
      setTransactionHistory([...transactionHistory, newMessage]); // Store previous messages
      setNewMessage(""); // Clear input field
      setStatus("Message updated successfully! ✅");
    } catch (error) {
      console.error("Transaction failed:", error);
      setStatus("Failed to update message ❌");
    }
  }
  useEffect(() => {
    fetchBalance(signer, provider);
  }, [fetchBalance, signer, provider]);


  return (
    <div className="container mt-5 p-4 bg-light rounded shadow-sm" style={{ maxWidth: "600px" }}>
  <h2 className="mb-4 text-center fw-bold text-primary"> Greeter DApp</h2>

  <div className="mb-4 p-3 bg-white rounded border align-items-center">
    <h4 className="fw-semibold"> Current Message:</h4>
    <p className="fw-semibold  mb-0 ms-3">{message}</p>
  </div>

  <div className="mb-3">
    <p><strong>💰 ETH Balance:</strong> {ethBalance} ETH</p>
    <strong>🔗 Wallet:</strong> {userAddress|| "Not connected"}
  </div>

  <div className="mb-3">
    <label htmlFor="newMessage" className="form-label fw-medium">Enter New Message</label>
    <input
      type="text"
      id="newMessage"
      className="form-control"
      value={newMessage}
      onChange={(e) => setNewMessage(e.target.value)}
      placeholder="Type a new greeting..."
    />
    <small className="text-muted">
      {newMessage.length}/{maxLength} characters
</small>

  </div>

  <div className="d-flex gap-2 justify-content-end mb-3">
    <button className="btn btn-primary" onClick={updateMessage}>
      Update Message
    </button>
    <button className="btn btn-outline-secondary" onClick={() => fetchMessage(contract)}>
      Refresh
    </button>
  </div>

  {status && (
  <div className="alert alert-info mt-3" role="alert">
    {status}
  </div>
    )}


  <h5 className="mt-4">📜 Message History</h5>
  <ul className="list-group">
    {transactionHistory.map((msg, index) => (
      <li key={index} className="list-group-item">{msg}</li>
      
    ))}
  </ul>

</div>

  );
}
  export default App;


// 🎨 Basic CSS Styling
// const styles = {
//   container: {
//     textAlign: "center",
//     padding: "20px",
//     fontFamily: "Arial, sans-serif",
//   },
//   input: {
//     padding: "8px",
//     marginRight: "10px",
//   },
//   button: {
//     padding: "8px 15px",
//     backgroundColor: "#4CAF50",
//     color: "white",
//     border: "none",
//     cursor: "pointer",
//   },
//   refreshButton: {
//     padding: "8px 15px",
//     marginLeft: "10px",
//     backgroundColor: "#008CBA",
//     color: "white",
//     border: "none",
//     cursor: "pointer",
//   },
//   status: {
//     marginTop: "10px",
//     color: "red",
//   },
//   historyList: {
//     listStyleType: "none",
//     padding: "0",
//   },
// };



//TODO LIst 
/* import React, { useEffect, useState } from 'react';
import { BrowserProvider, Contract } from 'ethers';

const contractAddress = '0xf6F5fEf7547b99C77eA5a7171a66DFAF60c9F9BA'; // Replace with your contract address
const contractABI = [
  'function getTodos() public view returns (tuple(uint, string, bool)[])',
  'function createTodo(string memory text) public',
  'function toggleTodoCompleted(uint id) public'
];

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const initBlockchain = async () => {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      const provider = new BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const todoContract = new Contract(contractAddress, contractABI, signer);
      setContract(todoContract);
      await loadTodos(todoContract);
    };

    initBlockchain();
  }, []);

  const loadTodos = async (todoContract) => {
    try {
      const todoList = await todoContract.getTodos();
      setTodos(todoList.map(todo => ({
        id: todo[0],
        text: todo[1],
        completed: todo[2]
      })));
    } catch (error) {
      console.error("Error loading todos:", error);
    }
  };

  const createTodo = async () => {
    if (!contract || newTodo.trim() === '') return;
    try {
      const tx = await contract.createTodo(newTodo);
      await tx.wait();
      setNewTodo('');
      loadTodos(contract);
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  };

  const toggleTodo = async (id) => {
    if (!contract) return;
    try {
      const tx = await contract.toggleTodoCompleted(id);
      await tx.wait();
      loadTodos(contract);
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };

  return (
    <div>
      <h1>Todo List</h1>
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Enter a new todo"
      />
      <button onClick={createTodo}>Add Todo</button>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            {todo.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App; */

// import { useState, useEffect, useCallback} from "react";
// import { ethers } from "ethers";
// import contractData from "./DeFiLending.json";

// const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

// function App() {
//   const [ethBalance, setEthBalance] = useState("0");
//   const [tokenBalance, setTokenBalance] = useState("0");
//   const [depositAmount, setDepositAmount] = useState("");
//   const [borrowAmount, setBorrowAmount] = useState("");
//   const [contract, setContract] = useState(null);
//   const [signer, setSigner] = useState(null);
//   const [provider, setProvider] = useState(null);

  

  

//   const loadProviderAndContract = useCallback(
//   async () => {
//     if (!window.ethereum) return;
//     const tempProvider = new ethers.BrowserProvider(window.ethereum);
//     await tempProvider.send("eth_requestAccounts", []);
//     const tempSigner = await tempProvider.getSigner();
//     const tempContract = new ethers.Contract(contractAddress, contractData.abi, tempSigner);

//     setProvider(tempProvider);
//     setSigner(tempSigner);
//     setContract(tempContract);
//     loadBalances(tempProvider, tempSigner, tempContract);

//     // Load balances
//     const ethBalance = await tempProvider.getBalance(await tempSigner.getAddress());
//     setEthBalance(ethers.formatEther(ethBalance));

//     const tokenAddress = await tempContract.token();
//     const tokenContract = new ethers.Contract(tokenAddress, [
//       "function balanceOf(address) view returns (uint256)"],
//       tempProvider);
      
//       const balance = await tokenContract.balanceOf(await tempSigner.getAddress());
//     setTokenBalance(ethers.formatUnits(balance, 18));
//     },[]);


//     async function loadBalances(provider, signer, contract) {
//     if (!signer || !contract) return;

//     const ethBalance = await provider.getBalance(await signer.getAddress());
//     setEthBalance(ethers.formatEther(ethBalance));

//     const tokenBalance = await contract.token();
//     const tokenContract = new ethers.Contract(tokenBalance, [
//       "function balanceOf(address) view returns (uint256)"
//     ], provider);
    
//     const balance = await tokenContract.balanceOf(await signer.getAddress());
//     console.log(`Contract Token Balance: ${ethers.formatUnits(balance, 18)} tokens`);
//     setTokenBalance(ethers.formatEther(balance));
//   }

//   useEffect(() => {
//     loadProviderAndContract();
//   }, [loadProviderAndContract]);

//   async function depositETH() {
//     if (!contract) return;
//     const tx = await contract.depositETH({ value: ethers.parseEther(depositAmount) });
//     await tx.wait();
//     loadBalances(provider, signer, contract);
//     loadProviderAndContract();
//     window.location.reload();//
//   }

//   async function borrowTokens() {
//     if (!contract) return;
//     const tx = await contract.borrow(ethers.parseUnits(borrowAmount, 18), { gasLimit: 300000 });
//     await tx.wait();
//     loadBalances(provider, signer, contract);
//     loadProviderAndContract();
//     window.location.reload();//
//   }

//   return (
//     <div>
//       <h1>DeFi Lending App</h1>
//       <p>ETH Balance: {ethBalance} ETH</p>
//       <p>Token Balance: {tokenBalance} Tokens</p>
      
//       <input
//         type="text"
//         placeholder="ETH Amount"
//         value={depositAmount}
//         onChange={(e) => setDepositAmount(e.target.value)}
//       />
//       <button onClick={depositETH}>Deposit ETH</button>

//       <input
//         type="text"
//         placeholder="Token Amount"
//         value={borrowAmount}
//         onChange={(e) => setBorrowAmount(e.target.value)}
//       />
//       <button onClick={borrowTokens}>Borrow Tokens</button>
//     </div>
//   );
// }

// export default App;
