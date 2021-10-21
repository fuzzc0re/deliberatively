// import { deserialize } from "borsh";
import {
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  SystemProgram,
  TransactionSignature,
  TransactionInstruction,
  Transaction,
  AccountMeta,
} from "@solana/web3.js";

import { DELIBERATIVELY_PROGRAM_ID, DELIBERATIVELY_SEED, MAX_VOTE_PARTICIPANT_LEN } from "../constants";

import { calculateCost } from "../utils";

export const participate = async (
  connection: Connection,
  prospectiveVoterPublicKey: PublicKey,
  sendTransaction: (transaction: Transaction, connection: Connection) => Promise<TransactionSignature>,
  VOTE_PROGRAM_ID: PublicKey
) => {
  // Derive the address (public key) of a voter account from the program so that it's easy to find later.
  const prospectiveVoterSeededPublicKey = await PublicKey.createWithSeed(
    prospectiveVoterPublicKey,
    DELIBERATIVELY_SEED[0].toString(),
    VOTE_PROGRAM_ID
  );

  // Check if the greeting account has already been created
  const prospectiveVoterAccount = await connection.getAccountInfo(prospectiveVoterSeededPublicKey);
  if (prospectiveVoterAccount === null) {
    console.log(
      "Creating account ",
      prospectiveVoterSeededPublicKey.toBase58(),
      " to become a voter in vote " + VOTE_PROGRAM_ID.toBase58()
    );

    const requiredLamports = await calculateCost(connection, MAX_VOTE_PARTICIPANT_LEN);
    const balance = await connection.getBalance(prospectiveVoterPublicKey);

    if (balance < requiredLamports) {
      // const sig = await connection.requestAirdrop(prospectiveVoterPublicKey, requiredLamports - balance);
      // await connection.confirmTransaction(sig);
      // lamports = await connection.getBalance(payerPublicKey);
      const transaction = new Transaction().add(
        SystemProgram.createAccountWithSeed({
          fromPubkey: prospectiveVoterPublicKey,
          basePubkey: prospectiveVoterPublicKey,
          seed: DELIBERATIVELY_SEED[0].toString(),
          newAccountPubkey: prospectiveVoterSeededPublicKey,
          lamports: requiredLamports,
          space: MAX_VOTE_PARTICIPANT_LEN,
          programId: DELIBERATIVELY_PROGRAM_ID,
        })
      );
      const transactionSignature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(transactionSignature);
      console.log(
        "Transaction transferred " +
          (requiredLamports - balance) / LAMPORTS_PER_SOL +
          " SOL with signature " +
          transactionSignature
      );
    }

    return prospectiveVoterSeededPublicKey.toBase58();
  } else {
    return prospectiveVoterSeededPublicKey.toBase58();
  }
};

/**
 * Rebalance portfolio
 */
// export const rebalance = async (
//   VOTE_PROGRAM_ID: PublicKey,
//   connection: Connection,
//   accountsList: AccountMeta[],
//   sendTransaction: (transaction: Transaction, connection: Connection) => Promise<TransactionSignature>
// ): Promise<void> => {
//   const instruction = new TransactionInstruction({
//     // keys: [
//     //   { pubkey: senderVoteAddress, isSigner: true, isWritable: false },
//     //   { pubkey: receiverVoteAddress, isSigner: false, isWritable: true }
//     // ],
//     keys: accountsList,
//     programId: DELIBERATIVELY_PROGRAM_ID,
//     data: Buffer.alloc(
//       new Blob(VOTE_PROGRAM_ID.toBuffer()).size + // public key of specific vote
//         // accountsList[0] is the wallet holder's publickey
//         // accountsList[1] is the wallet holder's publickey associated with the specific vote
//         // accountsList[2 and onward] is the receivers' addresses
//         (accountsList.length - 2) * 8
//       // number of receivers multiplied by the
//       // number from 1 to 100 representing percentage of voting power
//       // for each receiver adding up to 100
//     ),
//   });
//
//   const transaction = new Transaction().add(instruction);
//   await sendTransaction(transaction, connection);
// };

/**
 * Report portfolio and rebalancing times
 */
// export const getVoterInfo = async (connection: Connection, voter: PublicKey): Promise<void> => {
//   const accountInfo = await connection.getAccountInfo(voter);
//   if (accountInfo === null) {
//     throw "Error: cannot find the voter account";
//   }
//   const greeting = deserialize(VoteParticipantSchema, VoteParticipantAccount, accountInfo.data);
//   console.log(voter.toBase58(), " has been greeted ", greeting.counter, " time(s)");
// };
