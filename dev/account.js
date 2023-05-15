const nacl = require('tweetnacl');
const bs58 = require('bs58');
const { PublicKey } = require('@solana/web3.js');

class Account {
  constructor(secretKey) {
    if (secretKey) {
      this.secretKey = secretKey;
      this.publicKey = new PublicKey(nacl.sign.keyPair.fromSecretKey(secretKey).publicKey);
    } else {
      const keyPair = nacl.sign.keyPair();
      this.secretKey = keyPair.secretKey;
      this.publicKey = new PublicKey(keyPair.publicKey);
    }
  }

  toBase58() {
    return bs58.encode(this.secretKey);
  }

  static fromBase58(base58String) {
    const secretKey = bs58.decode(base58String);
    return new Account(secretKey);
  }
}

module.exports = Account;
