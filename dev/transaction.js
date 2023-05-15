const Transaction = require("./transaction");
class Transaction {
  constructor(feePayer) {
    this.transaction = new Transaction();
    this.transaction.feePayer = feePayer;
  }

  addInstruction(instruction) {
    this.transaction.add(instruction);
  }

  async sign(...signers) {
    const recentBlockhash = await this.getRecentBlockhash();
    this.transaction.recentBlockhash = recentBlockhash;
    this.transaction.sign(...signers);
  }

  serialize() {
    return this.transaction.serialize();
  }

  async send() {
    const signature = await this.rpc.sendTransaction(this.serialize());
    return signature;
  }

  async getRecentBlockhash() {
    const { blockhash } = await this.connection.getRecentBlockhash();
    return blockhash;
  }
}

module.exports = Transaction;

// This class provides an interface for constructing and submitting transactions to the Solana network.

// The addInstruction method is used to add a new instruction to the transaction.

// The sign method is used to sign the transaction using one or more private keys. It first retrieves a recent blockhash from the network, which is used to prevent replay attacks. The transaction is then signed using the private keys provided.

// The serialize method is used to serialize the transaction into a byte array, which can then be submitted to the Solana network.

// The send method is used to submit the serialized transaction to the Solana network and wait for confirmation. It returns the transaction signature.

// The getRecentBlockhash method is used to retrieve a recent blockhash from the Solana network. This is necessary for signing transactions, as it prevents replay attacks.
