class Transaction {
  constructor(amount, sender, recipient, transactionId) {
    this.amount = amount;
    this.sender = sender;
    this.recipient = recipient;
    this.transactionId = transactionId;
  }
}

module.exports = Transaction;