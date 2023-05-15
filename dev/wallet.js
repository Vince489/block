const EC = require('elliptic').ec;
const bip39 = require('bip39');
const hdkey = require('hdkey');
const bs58 = require('bs58');
const TokenAccount = require('./tokenAccount');
const Token = require('./token');

const ec = new EC('ed25519');

class Wallet {
  constructor() {
    this.tokenAccount = new Map();
    this.tokens = new Map();
    this.keyPair = null;
  }

  createNewTokenAccount() {
    let tokenAccount = new TokenAccount();
    this.tokenAccount.set(tokenAccount, tokenAccount);
  }

  createToken(name, symbol) {
    let token = new Token(name, symbol);
    this.tokens.set(symbol, token);
  }

  generateKeyPair() {
    try {
      // Generate a BIP39 mnemonic phrase (12 words)
      const mnemonic = bip39.generateMnemonic();

      // Derive a seed from the mnemonic phrase
      const seed = bip39.mnemonicToSeedSync(mnemonic);

      // Create a root HDNode from the seed
      const root = hdkey.fromMasterSeed(seed);

      // Derive a child HDNode for a specific path
      const path = "m/44'/220'/0'/0'/0, m/44'/220'/0'/0'/1, m/44'/220'/0'/0'/2";
      const child = root.derive(path);

      // Extract the private and public keys from the child HDNode
      const privateKey = child.privateKey.toString('hex');
      const publicKeyBuffer = Buffer.from(child.publicKey);

      const compressedPublicKeyBuffer = publicKeyBuffer.slice(0, 32);
      compressedPublicKeyBuffer[31] = compressedPublicKeyBuffer[31] & 0x7f;;

      // Encode the compressed public key using base58check encoding
      const publicKey = bs58.encode(compressedPublicKeyBuffer);

      // Set the key pair and public key as attributes of the wallet instance
      this.keyPair = { privateKey, publicKey };

      return this.keyPair;
    } catch (error) {
      console.error('Error generating key pair:', error);
      throw error;
    }
  }
}

// const wallet = new Wallet();
// wallet.generateKeyPair();
// console.log(wallet);

module.exports = Wallet;

// console.log(wallet.keyPair.privateKey); // private key as a hex string
// console.log(wallet.keyPair.publicKey); // public key as a base58 encoded string
// console.log(wallet); // same public key as above, stored as an attribute of the wallet instance
