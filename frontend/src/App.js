import {useEffect, useState} from 'react';
import {ethers} from 'ethers';
import contractAbi from './utils/contractAbi.json'
import { CgSpinner } from "react-icons/cg";
import { networks } from './utils/networks';
import { FaHandPointDown } from "react-icons/fa";

const CONTRACT_ADDRESS = '0xe12ace2441dad94cd59f8bacfdcdd6b92f5e4c3f'
function App() {
  const[currentAccount, setCurrentAccount] = useState('')
  const[alreadyWhitelist, setAlreadyWhitelist] = useState(false)
  const [joinWhitelist, setJoinWhitelist] = useState(false)
  const[loading, setLoading] = useState(false)
  const[network, setNetwork] = useState('')
  const[transactionPending, setTransactionPending] = useState()

  const checkIfWalletIsConnected = async () =>{
    const {ethereum} = window

    if(!ethereum){
      console.log("please get metamask")
    }else{
      console.log("we have ethereum", ethereum)
    }
    const accounts = await ethereum.request({method: 'eth_accounts'})
    if(accounts.length !== 0){
      const account = accounts[0]
      setCurrentAccount(account)
			console.log("we have an authorized account:", account);
    }else{
			console.log("we dont have authorized account:");
    }

    const chaindId = await ethereum.request({method: 'eth_chainId'});
    setNetwork(networks[chaindId])

    ethereum.on('chainChanged', handleChainChanged);

    function handleChainChanged(_chainId){
      window.location.reload();
    }


  }

  const connectWallet = async () =>{
    try{
      const {ethereum} = window;
      if(!ethereum){
        alert('get metamask');
        return
      }else{
        const accounts = await ethereum.request({method: 'eth_requestAccounts'})
        setCurrentAccount(accounts[0]);
      }

    }catch(error){
      console.log(error)
    }
  }

  const renderLoginButton = ()=>{
    return(
    <div className='login flex flex-col items-center h-[60vh] justify-center auto'>
        <p className='text-2xl' >Connect your wallet and get Whitelisted for our upcoming drops</p>
        <button onClick={connectWallet} className='p-2 bg-red-400 rounded h-12 '>Connect Wallet</button>
    </div>
  )}

  const whitelistAddress = async () => {
    try{
      const {ethereum} = window;
      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner()
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);
        console.log("going to pop up to pay gas now....");
        setTransactionPending(true)
          
        let txn = await contract.whitelistAddress()
        const receipt = await txn.wait()

        if(receipt.status === 1){
          console.log("transaction successful");
          setJoinWhitelist(true)
          setTransactionPending(false)
        }
        else{
          alert('transaction failed');
          setTransactionPending(false)
        }
      } 
    }catch(error){
      console.log(error)
      if(error.code === -32603){
        setAlreadyWhitelist(true)
        setTransactionPending(false)
      }
      setTransactionPending(false)
    }
  }
  const switchNetwork = async () => {
		if (window.ethereum) {
		  try {
			// Try to switch to the Mumbai testnet
			await window.ethereum.request({
			  method: 'wallet_switchEthereumChain',
			  params: [{ chainId: '0x13881' }], // Check networks.js for hexadecimal network ids
			});
		  } catch (error) {
			// This error code means that the chain we want has not been added to MetaMask
			// In this case we ask the user to add it to their MetaMask
			if (error.code === 4902) {
			  try {
				await window.ethereum.request({
				  method: 'wallet_addEthereumChain',
				  params: [
					{	
					  chainId: '0x13881',
					  chainName: 'Polygon Mumbai Testnet',
					  rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
					  nativeCurrency: {
						  name: "Mumbai Matic",
						  symbol: "MATIC",
						  decimals: 18
					  },
					  blockExplorerUrls: ["https://mumbai.polygonscan.com/"]
					},
				  ],
				});
			  } catch (error) {
				console.log(error);
			  }
			}
			console.log(error);
		  }
		} else {
		  // If window.ethereum is not found then MetaMask is not installed
		  alert('MetaMask is not installed. Please install it to use this app: https://metamask.io/download.html');
		} 
	  }

  const whitelistRender = () => {
    if(network !== 'Polygon Mumbai Testnet'){
      return(
        <div className="switch h-[70vh] rounded w-60%  space-y-10 flex flex-col items-center justify-center m-auto ">
          <p className='text-2xl p-4 lg:text-5xl text-center flex flex-col items-center justify-between space-y-5' >Please connect to Polygon Mumbai Testnet
          <FaHandPointDown className='animate-bounce' size={64} />
          </p>
          <button className='bg-yellow-600 shadow text-white hover:bg-red-300 font-semibold text-xl space-x-3 rounded p-4 flex items-center justify-between' onClick={switchNetwork} >Click here to switch</button>
        </div>
      )
    }
    return (
      <div className='h-[70vh] rounded w-60%  space-y-10 flex flex-col items-center justify-center m-auto' >
      <img src="https://giphy.com/media/oFMsgQujTj8iuO0ZZp" alt=""  />
      <p className='text-2xl p-4 lg:text-5xl text-center' >Join our Whitelist to enjoy our upcoming drops</p>
      <button onClick={whitelistAddress} className='bg-yellow-400 text-black hover:bg-red-300 font-semibold text-xl space-x-3 rounded p-4 flex items-center justify-between'>
        {transactionPending &&  <CgSpinner className='animate-spin' />}
        Get Whitelisted!
      </button>
  </div>
    )
  }
  const whitelistSuccess = () =>{
    return(
      <div className='h-[70vh] rounded w-60%  space-y-10 flex flex-col items-center justify-center m-auto' >
        <p className='text-2xl p-4 text-center lg:text-5xl '>Congratulations You've been whitelisted, check back later for our drops, You're in the front row!! </p>
      </div>
    )
  }

  const alreadyWhitelisted = () => {
    return(
      <div className='h-[70vh] rounded w-60%  space-y-10 flex flex-col items-center justify-center m-auto' >
        <p className='text-2xl p-4 text-center lg:text-5xl '>You've already been whitelisted, check back later for our drops, You're in the front row!! </p>
      </div>
    )
  }






  useEffect(() => {
      checkIfWalletIsConnected()
  },[])            
  return (
    <div className="App text-white">
     <header className='flex justify-between' >
     <div className="logo p-4 text-xl">
        <h1>Whitelist Dapp</h1>
      </div>

      <div className="user-wallet p-4">
        {currentAccount ? <p className='bg-blue-400 p-2 text-black rounded'> Wallet: {currentAccount.slice(0,6)}...{currentAccount.slice(-4)} </p> : <p className='text-xl bg-red-300 p-2 rounded' >Not Connected</p>}
      </div>
     </header>

      {!currentAccount && renderLoginButton()}
   {!joinWhitelist ? currentAccount && whitelistRender() : ''}
  {!alreadyWhitelist ? joinWhitelist && whitelistSuccess() : alreadyWhitelisted()}
    </div>
  );
}

export default App;
