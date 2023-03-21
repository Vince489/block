class Transaction {
  constructor(sender, recipient, amount) {
    this.sender = sender;
    this.recipient = recipient;
    this.amount = amount;
    this.timestamp = Date.now();
    this.signature = null;
  }

  signTransaction(privateKey) {
    const key = ec.keyFromPrivate(privateKey);
    const hash = SHA256(this.sender + this.recipient + this.amount + this.timestamp).toString();
    const signature = key.sign(hash, 'base64');
    this.signature = signature.toDER('hex');
  }

  isValid() {
    if (!this.signature || this.signature.length === 0) {
      return false;
    }
    const key = ec.keyFromPublic(this.sender, 'hex');
    const hash = SHA256(this.sender + this.recipient + this.amount + this.timestamp).toString();
    return key.verify(hash, this.signature);
  }
}
