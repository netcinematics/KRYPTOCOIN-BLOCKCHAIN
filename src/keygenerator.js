const EC = require('elliptic').ec; //make keys and verify sig
const ec = new EC('secp256k1'); //basis of bitcoin wallets

const key = ec.genKeyPair();
const publicKey = key.getPublic('hex');
const privateKey = key.getPrivate('hex');
console.log();
console.log('Private KEY:', privateKey);
console.log();
console.log('Public KEY', publicKey);

//needed to sign transactions, and to verify balance on wallet.