import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Alchemy, Network } from 'alchemy-sdk';
import axios from 'axios';

const settings = {
 apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
 network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

const LatestBlock = () => {
 const [blockNumber, setBlockNumber] = useState(null);
 const [block, setBlock] = useState(null);
 const [transactions, setTransactions] = useState([]);
 const [ethPriceInBTC, setEthPriceInBTC] = useState(null);
 const [ethPriceInUSD, setEthPriceInUSD] = useState(null);

 useEffect(() => { 
 async function getLatestBlockNumber() {
 const blockNumber = await alchemy.core.getBlockNumber();
 setBlockNumber(blockNumber);
 const latestBlock = await alchemy.core.getBlock(blockNumber);
 setBlock(latestBlock);
 setTransactions(latestBlock.transactions);
 }

 getLatestBlockNumber();
 }, [setBlock, setBlockNumber, setTransactions]);

 useEffect(() => {
 async function getEthPrice() {
 const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=btc,usd');
 setEthPriceInBTC(response.data.ethereum.btc);
 setEthPriceInUSD(response.data.ethereum.usd);
 }

 getEthPrice();
}, []);

return (
 <div className="App">
 <div className="logo-container">
 <div className="logo">
 <h1>slumscan.io</h1>
 </div>
 <div className="eth-price-container">
 <p>Ξ1 = ${ethPriceInUSD} = ₿{ethPriceInBTC}</p>
 </div>
 </div>
 <p style={{ fontSize: '20px', backgroundColor: '#4d004d', paddingTop: '16px', paddingRight: '10px' }}>Latest Block: {blockNumber ? blockNumber : 'Loading... '}</p>
 {block && (
 <div className="blockDetails">
 <p style={{ fontSize: '20px' }}>Block Details:</p>
 <table>
 <tbody>
  {Object.keys(block).map((key) => {
    if (['nonce', 'difficulty', '_difficulty', 'transactions'].includes(key)) {
      return null;
    }
    return (
      <tr key={key}>
       <td>{key}</td>
       <td>{key === 'miner' ? <Link to={`/address/${block[key]}`}>{block[key]}</Link> : block[key].toString()}</td>
      </tr>
    );
  })}
 </tbody>
 </table>
 </div>
 )}
 {transactions.length > 0 && (
 <div className="transactions">
 Transactions:
 <table>
 <tbody>
  {transactions.map((transaction, index) => (
    <tr key={index}>
      <td><Link to={`/tx/${transaction}`}>{transaction}</Link></td>
    </tr>
  ))}
 </tbody>
 </table>
 </div>
 )}
 </div>
 );
}

export default LatestBlock;