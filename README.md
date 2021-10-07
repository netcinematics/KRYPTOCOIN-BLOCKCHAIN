# COZMOCOIN-BLOCKCHAIN
JavaScript Blockchain (Proof of Work) template

Learning BLOCKCHAIN, with variations...

1. a basic Block class and a BlockChain class
   //npm install --save crypto-js    //for sha256 hash of block
   //node main
   - contains an index, date, and any data
   - all data is sha 256 encrypted into a hash
   - the hash becomes the id, set for next block as prev hash
   - hash ensures integrity of chain like a manifest
   - starts with a genesis block
   - loop through the chain to confirm validity
2. Proof of Work
   - limit blocks to 1 per 10 mins
   - prepend difficulty of zeros and a nonce to track loop
   - loop calculateHash sha256, until it gives number of zeros as difficulty.
   - slows block creation, so that hashes cannot be manipulated.
3. Miner Rewards and Pending Transactions
   - slowing down block creation, created pending transactions.
   - put transaction class in an array, and into the hash
   - mining reward paid out after mining, start of next block of transactions.
   - getAddress loops through all chain and transactions to determine balance
4. Securing the transactions with signed private and public key
   - only spend coins, if you have private key.
   - keygenerator, and wallet
   - npm install elliptic
   - sign transactions, 
   - check signature is valid
   - transaction has calculateHash, just like block
   - signTransaction takes signing key, object from EC.
