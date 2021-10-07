const {Blockchain1, Transaction} = require('./BlockChain1')
const EC = require('elliptic').ec; //make keys and verify sig
const ec = new EC('secp256k1'); //basis of bitcoin wallets

const myKey = ec.keyFromPrivate('bdcf2a782f0b665edc27c4e6839b58ee2055b5998973fea4840d1e9f239fea10');
const myWalletAddress = myKey.getPublic('hex');


let cozmoCoin = new Blockchain1();

const tx1 = new Transaction(myWalletAddress, 'public key destination wallet', 4)
tx1.signTransaction(myKey);
cozmoCoin.addTransaction(tx1);

// cozmoCoin.createTransaction(new Transaction('address1', 'address2', 400))
// cozmoCoin.createTransaction(new Transaction('address2', 'address1', 44))

console.log('\n Starting Block Miner');
cozmoCoin.minePendingTransactions(myWalletAddress);
// cozmoCoin.minePendingTransactions('minerAddress');
console.log('Is Valid?', cozmoCoin.isChainValid())

console.log("BALANCE: ", cozmoCoin.getBalanceOfAddress(myWalletAddress))
// console.log("BALANCE: ", cozmoCoin.getBalanceOfAddress('minerAddress'))
//Miner paid in next block, so balance is not updated until next block
cozmoCoin.minePendingTransactions(myWalletAddress);
console.log("BALANCE: ", cozmoCoin.getBalanceOfAddress('minerAddress'))
// console.log("Mine block 1...")
// cozmoCoin.addBlock(new Block1(1, "01/02/2022", {amount:44}));
// console.log("Mine block 2...")
// cozmoCoin.addBlock(new Block1(2, "01/03/2022", {amount:444}));

// console.log('Is Valid?', cozmoCoin.isChainValid())
// console.log(JSON.stringify(cozmoCoin,null,4));
