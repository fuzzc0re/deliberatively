import { Keypair } from "@solana/web3.js";

export const randomKeys: Array<string> = [];

for (let i = 0; i < 100; i++) {
  const rk = Keypair.generate();
  randomKeys.push(rk.publicKey.toBase58());
}
