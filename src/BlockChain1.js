const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec; //make keys and verify sig
const ec = new EC('secp256k1'); //basis of bitcoin wallets


class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

    calculateHash(){
        //dont sign all data, just the hash, with PK.
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
    }

    signTransaction(signingKey){
        if(signingKey.getPublic('hex') !== this.fromAddress){
            throw new Error('Cannot sign transaction from this wallet')
        }

        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx, 'base64');
        this.signature = sig.toDER('hex');
    }

    isValid(){ //verify if transaction is correctly signed.
        if(this.fromAddress === null) return true; //mining transaction
        if(!this.signature || this.signature.length === 0){
            throw new Error('No signature in transaction')
        }
        //verify transaction signed with correct key
        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
    }
}
class Block1{ 
    // constructor(index, timestamp, data, previousHash = ''){
    constructor(timestamp, transactions, data, previousHash = ''){
        //index - where it sits on chain, timestame = when created
        //data - Any Data: transaction details, sender receiver. 
        //previousHash - ensures the integrity of BLOCKCHAIN.
        //this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash(); //hash of this block. Need to calculateHash for this block with properties.
        this.nonce = 0; //random number, increment in while loop;. added to hash. Secure from spammers.
    }

    calculateHash(){ //sha 256 string not object.
        // return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
        return SHA256(JSON.stringify(this.transactions) + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty){ //Prove computing power in block POW. Bitcoin has - certain number of zeros.
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){ //POW until SHA num of zeros ='s difficulty num 0's
            this.nonce++; 
            this.hash = this.calculateHash(); //sha guesses until number of zeros matches. Slows down rate. Requires work.
        } //bitcoin at about 1 new block every ten minutes, faster computers guess faster, so increase difficulty. 
        console.log("block mined: " + this.hash);
    }

    hasValidTransactions(){ //iterate every transaction
        for( const tx of this.transactions){
            if(!tx.isValid()){
                return false;
            }
        }
        return true;
    }
}

class Blockchain1{
    constructor(){
        // this.chain = [new Block1(0, "01/01/2022", "Genesis block", "0")];
        this.chain = [new Block1("01/01/2022", [], "Genesis block", "0")];
        this.difficulty = 2; //POW incrementing this, slows block creation by prepending 0's.
        this.pendingTransactions = []; //if ahead of 10mins, pow, temp stored for next block.
        this.miningReward = 102; //success for mining a new block.
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    // addBlock(newBlock){ //anytime properties change, change new hash. Mining Methos
    //     newBlock.previousHash = this.getLatestBlock().hash;
    //     //newBlock.hash = newBlock.calculateHash(); //too fast. no scarcity.
    //     newBlock.mineBlock(this.difficulty) //POW.
    //     this.chain.push(newBlock);
    // }

    minePendingTransactions(miningRewardAddress){ //Mining Methos gives miner reward and mints with pending transactions.
        let block = new Block1(Date.now(), this.pendingTransactions, {data:0}); // fill up the blocksize with pending transactions, miners pick.
        block.previousHash = this.getLatestBlock().hash;
        block.mineBlock(this.difficulty);
        console.log('Block Mined with pending transactions and reward.');
        this.chain.push(block);
        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward) //send reward, in the next block minted as transaction.
        ]
    }

    // createTransaction(transaction){ //populate transactions for next block mint-.
    addTransaction(transaction){ //populate transactions for next block mint-.
        if(!transaction.fromAddress || !transaction.toAddress){
            throw new Error('Transaction must have from and to address')
        }
        if(!transaction.isValid()){
            throw new Error('Cannot add invalid transaction')
        }
        this.pendingTransactions.push(transaction);
    } 
    
    //bitcoin isnt actually sent out of wallet, all is stored on chain, so chain holds wallet address for the coin.
    getBalanceOfAddress(address){ //wallet balance has to search chain for all blocks for the total
        let balance = 0;
        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }
                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }

    isChainValid(){ //go over oall blocks verify hashes and transactions valid
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if(!currentBlock.hasValidTransactions()){
                return false;
            }
            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }
            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }
        return true;
    }
}

module.exports.Blockchain1 = Blockchain1;
module.exports.Transaction = Transaction;