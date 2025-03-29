//Mycontract 
/* import { useState, useEffect } from "react";
import { ethers } from "ethers";

import contractData from "./Mycontract.json";


const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

function App() {


  const [message, setMessage] = useState("");
  const [newMessage, setNewMessage] = useState("");

  useEffect(() =>{
    fetchMessage();

  },[]);

  async function fetchMessage()
  {
    if(!window.ethereum) return;
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, contractData.abi, provider);
    setMessage(await contract.message());
  }
  async function updateMessage()
  {
    if(!window.ethereum) return;
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractData.abi, signer);
    const tx = await contract.updateMessage(newMessage);
    await tx.wait();
    fetchMessage();
    
  }
  return (
    <div>
      <h1>Current Message: {message}</h1>
      <input
        type = "text"
        value ={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Enter new message"
      />
      <button onClick = {updateMessage} >Update Message</button>
    </div>
  );

}

export default App; */


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

import { useState, useEffect, useCallback} from "react";
import { ethers } from "ethers";
import contractData from "./DeFiLending.json";

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

function App() {
  const [ethBalance, setEthBalance] = useState("0");
  const [tokenBalance, setTokenBalance] = useState("0");
  const [depositAmount, setDepositAmount] = useState("");
  const [borrowAmount, setBorrowAmount] = useState("");
  const [contract, setContract] = useState(null);
  const [signer, setSigner] = useState(null);
  const [provider, setProvider] = useState(null);

  

  

  const loadProviderAndContract = useCallback(
  async () => {
    if (!window.ethereum) return;
    const tempProvider = new ethers.BrowserProvider(window.ethereum);
    await tempProvider.send("eth_requestAccounts", []);
    const tempSigner = await tempProvider.getSigner();
    const tempContract = new ethers.Contract(contractAddress, contractData.abi, tempSigner);

    setProvider(tempProvider);
    setSigner(tempSigner);
    setContract(tempContract);
    loadBalances(tempProvider, tempSigner, tempContract);

    // Load balances
    const ethBalance = await tempProvider.getBalance(await tempSigner.getAddress());
    setEthBalance(ethers.formatEther(ethBalance));

    const tokenAddress = await tempContract.token();
    const tokenContract = new ethers.Contract(tokenAddress, [
      "function balanceOf(address) view returns (uint256)"],
      tempProvider);
      
      const balance = await tokenContract.balanceOf(await tempSigner.getAddress());
    setTokenBalance(ethers.formatUnits(balance, 18));
    },[]);


    async function loadBalances(provider, signer, contract) {
    if (!signer || !contract) return;

    const ethBalance = await provider.getBalance(await signer.getAddress());
    setEthBalance(ethers.formatEther(ethBalance));

    const tokenBalance = await contract.token();
    const tokenContract = new ethers.Contract(tokenBalance, [
      "function balanceOf(address) view returns (uint256)"
    ], provider);
    
    const balance = await tokenContract.balanceOf(await signer.getAddress());
    console.log(`Contract Token Balance: ${ethers.formatUnits(balance, 18)} tokens`);
    setTokenBalance(ethers.formatEther(balance));
  }

  useEffect(() => {
    loadProviderAndContract();
  }, [loadProviderAndContract]);

  async function depositETH() {
    if (!contract) return;
    const tx = await contract.depositETH({ value: ethers.parseEther(depositAmount) });
    await tx.wait();
    loadBalances(provider, signer, contract);
    loadProviderAndContract();
    window.location.reload();//
  }

  async function borrowTokens() {
    if (!contract) return;
    const tx = await contract.borrow(ethers.parseUnits(borrowAmount, 18), { gasLimit: 300000 });
    await tx.wait();
    loadBalances(provider, signer, contract);
    loadProviderAndContract();
    window.location.reload();//
  }

  return (
    <div>
      <h1>DeFi Lending App</h1>
      <p>ETH Balance: {ethBalance} ETH</p>
      <p>Token Balance: {tokenBalance} Tokens</p>
      
      <input
        type="text"
        placeholder="ETH Amount"
        value={depositAmount}
        onChange={(e) => setDepositAmount(e.target.value)}
      />
      <button onClick={depositETH}>Deposit ETH</button>

      <input
        type="text"
        placeholder="Token Amount"
        value={borrowAmount}
        onChange={(e) => setBorrowAmount(e.target.value)}
      />
      <button onClick={borrowTokens}>Borrow Tokens</button>
    </div>
  );
}

export default App;
