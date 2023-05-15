const sha256 = require('sha256');
const currentNodeUrl = process.argv[3];
const uuid = require('uuid/v1');
const Block = require('./block');
const EC = require('elliptic').ec;
const ec = new EC('ed25519');

const bip39 = require('bip39');
const hdkey = require('hdkey');
const crypto = require('crypto');
const bs58 = require('bs58');

class Token {
  constructor(name, symbol, totalSupply) {
    this.name = name;
    this.symbol = symbol;
    this.totalSupply = totalSupply;
    this.balanceMap = {};
  }

  createTokenAccount(address) {
    if (!this.balanceMap[address]) {
      this.balanceMap[address] = 0;
    }
  }

  getBalance(address) {
    return this.balanceMap[address] || 0;
  }

  transfer(sender, recipient, amount) {
    if (this.getBalance(sender) >= amount) {
      this.balanceMap[sender] -= amount;
      this.balanceMap[recipient] = (this.balanceMap[recipient] || 0) + amount;
      return true;
    }
    return false;
  }
}

class TokenAccount {
  constructor(token) {
    this.token = token;
    this.metadata = {};
  }

  getBalance() {
    return this.token.getBalance(this.address);
  }

  transfer(recipient, amount) {
    return this.token.transfer(this.address, recipient, amount);
  }
}

class Transaction {
  constructor(amount, sender, recipient, transactionId, tokenAccount) {
    this.amount = amount;
    this.sender = sender;
    this.recipient = recipient;
    this.transactionId = transactionId;
    this.tokenAccount = tokenAccount;
  }

  signTransaction(key) {
    const sign = key.sign(this.toString(), 'base64');
    this.signature = sign.toDER('hex');
  }

  isValid() {
    if (!this.signature || this.signature === '') {
      throw new Error('No signature in this transaction');
    }

    const publicKey = this.tokenAccount.address.getPublic().encode('hex');
    const verifier = crypto.createVerify('SHA256');
    verifier.update(this.toString());

    return verifier.verify(publicKey, this.signature);
  }

  // toString() {
  //   return JSON.stringify(this);
  // }
}

class Blockchain {
  constructor() {
    this.chain = [];
    this.pendingTransactions = [];
    this.currentNodeUrl = currentNodeUrl;
    this.networkNodes = [];
    this.token = new Token('MyToken', 'MTK', 1000000);
    this.createNewBlock(100, '0', '0');
  }

  createNewBlock(nonce, previousBlockHash, hash) {
    const newBlock = new Block(
      this.chain.length + 1,
      Date.now(),
      this.pendingTransactions,
      nonce,
      hash,
      previousBlockHash
    );

    this.pendingTransactions = [];
    this.chain.push(newBlock);

    return newBlock;
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  createNewTransaction(amount, sender, recipient, tokenAccount) {
    const transactionId = uuid().split('-').join('');
    const newTransaction = new Transaction(amount, sender, recipient, transactionId, tokenAccount);
    return newTransaction;
  }

  addTransactionToPendingTransactions(transaction) {
    if (transaction.isValid()) {
      this.pendingTransactions.push(transaction);
      return this.getLastBlock().index + 1;
    }
    throw new Error('Invalid transaction');
  }

  hashBlock(previousBlockHash, currentBlockData, nonce) {
    const dataAsString =
      previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
    const hash = sha256(dataAsString);
    return hash;
  }

  proofOfWork(previousBlockHash, currentBlockData) {
    let nonce = 0;
    let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    while (hash.substring(0, 4) !== '0000') {
      nonce++;
      hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    }
    return nonce;
  }

  chainIsValid (blockchain) {
    let validChain = true;

    for (let i = 1; i < blockchain.length; i++) {
      const currentBlock = blockchain[i];
      const prevBlock = blockchain[i - 1];
      const blockHash = this.hashBlock(prevBlock['hash'], { transactions: currentBlock['transactions'], index: currentBlock['index'] }, currentBlock['nonce']);

      if (blockHash.substring(0, 4) !== '0000') validChain = false;
      if (currentBlock['previousBlockHash'] !== prevBlock['hash']) validChain = false;
    };

    const genesisBlock = blockchain[0];
    const correctNonce = genesisBlock['nonce'] === 100;
    const correctPreviousBlockHash = genesisBlock['previousBlockHash'] === '0';
    const correctHash = genesisBlock['hash'] === '0';
    const correctTransactions = genesisBlock['transactions'].length === 0;

    if (!correctNonce || !correctPreviousBlockHash || !correctHash || !correctTransactions) validChain = false;

    return validChain;
  }

  getBlock(blockHash) {
    let correctBlock = null;
    this.chain.forEach(block => {
      if (block.hash === blockHash) correctBlock = block;
    });
    return correctBlock;
  }

  getTransaction(transactionId) {
    let correctTransaction = null;
    let correctBlock = null;

    this.chain.forEach(block => {
      block.transactions.forEach(transaction => {
        if (transaction.transactionId === transactionId) {
          correctTransaction = transaction;
          correctBlock = block;
        };
      });
    });

    return {
      transaction: correctTransaction,
      block: correctBlock
    };
  }

  getAddressData(address) {
    const addressTransactions = [];
    this.chain.forEach(block => {
      block.transactions.forEach(transaction => {
        if (transaction.sender === address || transaction.recipient === address) {
          addressTransactions.push(transaction);
        };
      });
    });

    let balance = 0;
    addressTransactions.forEach(transaction => {
      if (transaction.recipient === address) balance += transaction.amount;
      else if (transaction.sender === address) balance -= transaction.amount;
    });

    return {
      addressTransactions: addressTransactions,
      addressBalance: balance
    };
  }
}

const bitcoin = new Blockchain();
const tokenAccount = new TokenAccount(bitcoin.token);
const key = ec.genKeyPair();
const publicKey = key.getPublic('hex');
const privateKey = key.getPrivate('hex');
const address = key.getPublic();
tokenAccount.address = address;

const tx1 = bitcoin.createNewTransaction(100, 'address1', 'address2', tokenAccount);
tx1.signTransaction(key);
bitcoin.addTransactionToPendingTransactions(tx1);

const tx2 = bitcoin.createNewTransaction(50, 'address2', 'address1', tokenAccount);
tx2.signTransaction(key);
bitcoin.addTransactionToPendingTransactions(tx2);

