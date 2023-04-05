const bip39 = require('bip39');
const hdkey = require('hdkey');

// Generate a BIP39 mnemonic phrase (12 words)
const mnemonic = bip39.generateMnemonic();

// Derive a seed from the mnemonic phrase
const seed = bip39.mnemonicToSeedSync(mnemonic);

// Create a root HDNode from the seed
const root = hdkey.fromMasterSeed(seed);

// Derive a child HDNode for a specific path
const path = "m/44'/60'/0'/0/0";
const child = root.derive(path);

// Extract the private and public keys from the child HDNode
const privateKey = child.privateKey.toString('hex');
const publicKey = child.publicKey.toString('hex');


// Log the results
console.log('BIP39 Mnemonic Phrase:', mnemonic);
console.log('Derived Path:', path);
console.log('Private Key:', privateKey);
console.log('Public Key:', publicKey);



