const bs58 = require('bs58');
const nacl = require('tweetnacl');
const { Account } = require('@solana/web3.js');

class PublicKey {
  constructor(value) {
    this.value = value;
  }

  toBase58() {
    return bs58.encode(this.value);
  }

  static fromBase58(base58String) {
    const value = bs58.decode(base58String);
    return new PublicKey(value);
  }

  static async findProgramAddress(seeds, programId) {
    const seedsWithProgramId = seeds.concat([programId.toBuffer()]);
    const [publicKey, nonce] = await PublicKey._findProgramAddress(seedsWithProgramId, programId);
    return [new PublicKey(publicKey), nonce];
  }

  static _findProgramAddress(seeds, programId) {
    let nonce = 255;
    const seedsWithNonce = seeds.concat([Buffer.from([nonce])]);

    const buffer = Buffer.alloc(32 * (seedsWithNonce.length + 1));
    let offset = 0;
    seedsWithNonce.forEach(seed => {
      buffer.set(seed, offset);
      offset += seed.length;
    });

    buffer.set(programId.toBuffer(), offset);
    const hash = nacl.hash(buffer);

    let publicKey = new Account().publicKey.toBuffer();
    for (let i = 0; i < 256; i++) {
      buffer.set(publicKey, 0);
      buffer[seedsWithNonce.length * 32] = i;
      const thisHash = nacl.hash(buffer);
      if (thisHash.toString() === hash.toString()) {
        return [publicKey, nonce];
      }
    }

    throw new Error('Unable to find a viable program address nonce');
  }
}

module.exports = PublicKey;
