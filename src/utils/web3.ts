export const skata = "Skata";
// import { AccountLayout, Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
// import {
//   Account,
//   Connection,
//   ParsedAccountData,
//   PublicKey,
//   SystemProgram,
//   SYSVAR_RENT_PUBKEY,
//   Transaction,
//   TransactionInstruction,
// } from "@solana/web3.js";
// import BN from "bn.js";
//
// const connection = new Connection("http://localhost:8899", "singleGossip");
//
// export const initEscrow = async (
//   privateKeyByteArray: string,
//   initializerXTokenAccountPubkeyString: string,
//   amountXTokensToSendToEscrow: number,
//   initializerReceivingTokenAccountPubkeyString: string,
//   expectedAmount: number,
//   escrowProgramIdString: string
// ) => {
//   const initializerXTokenAccountPubkey = new PublicKey(initializerXTokenAccountPubkeyString);
//
//   const XTokenMintAccountPubkey = new PublicKey("");
//   // const XTokenMintAccountPubkey = new PublicKey(
//   //   (await connection.getParsedAccountInfo(initializerXTokenAccountPubkey, "singleGossip")).value!.data as ParsedAccountData.parsed.info.mint
//   // );
//
//   const privateKeyDecoded = privateKeyByteArray.split(",").map((s) => parseInt(s));
//   const initializerAccount = new Account(privateKeyDecoded);
//
//   const tempTokenAccount = new Account();
//   const createTempTokenAccountIx = SystemProgram.createAccount({
//     programId: TOKEN_PROGRAM_ID,
//     space: AccountLayout.span,
//     lamports: await connection.getMinimumBalanceForRentExemption(AccountLayout.span, "singleGossip"),
//     fromPubkey: initializerAccount.publicKey,
//     newAccountPubkey: tempTokenAccount.publicKey,
//   });
//   const initTempAccountIx = Token.createInitAccountInstruction(
//     TOKEN_PROGRAM_ID,
//     XTokenMintAccountPubkey,
//     tempTokenAccount.publicKey,
//     initializerAccount.publicKey
//   );
//   const transferXTokensToTempAccIx = Token.createTransferInstruction(
//     TOKEN_PROGRAM_ID,
//     initializerXTokenAccountPubkey,
//     tempTokenAccount.publicKey,
//     initializerAccount.publicKey,
//     [],
//     amountXTokensToSendToEscrow
//   );
//
//   const escrowAccount = new Account();
//   const escrowProgramId = new PublicKey(escrowProgramIdString);
//
//   const createEscrowAccountIx = SystemProgram.createAccount({
//     space: 16,
//     lamports: await connection.getMinimumBalanceForRentExemption(16, "singleGossip"),
//     fromPubkey: initializerAccount.publicKey,
//     newAccountPubkey: escrowAccount.publicKey,
//     programId: escrowProgramId,
//   });
//
//   const initEscrowIx = new TransactionInstruction({
//     programId: escrowProgramId,
//     keys: [
//       { pubkey: initializerAccount.publicKey, isSigner: true, isWritable: false },
//       { pubkey: tempTokenAccount.publicKey, isSigner: false, isWritable: true },
//       { pubkey: new PublicKey(initializerReceivingTokenAccountPubkeyString), isSigner: false, isWritable: false },
//       { pubkey: escrowAccount.publicKey, isSigner: false, isWritable: true },
//       { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
//       { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
//     ],
//     data: Buffer.from(Uint8Array.of(0, ...new BN(expectedAmount).toArray("le", 8))),
//   });
//
//   const tx = new Transaction().add(
//     createTempTokenAccountIx,
//     initTempAccountIx,
//     transferXTokensToTempAccIx,
//     createEscrowAccountIx,
//     initEscrowIx
//   );
//   await connection.sendTransaction(tx, [initializerAccount, tempTokenAccount, escrowAccount], {
//     skipPreflight: false,
//     preflightCommitment: "singleGossip",
//   });
//
//   await new Promise((resolve) => setTimeout(resolve, 1000));
//
//   const encodedEscrowState = (await connection.getAccountInfo(escrowAccount.publicKey, "singleGossip"))!.data;
//   // const decodedEscrowState = ESCROW_ACCOUNT_DATA_LAYOUT.decode(encodedEscrowState) as EscrowLayout;
//   // return {
//   //   escrowAccountPubkey: escrowAccount.publicKey.toBase58(),
//   //   isInitialized: !!decodedEscrowState.isInitialized,
//   //   initializerAccountPubkey: new PublicKey(decodedEscrowState.initializerPubkey).toBase58(),
//   //   XTokenTempAccountPubkey: new PublicKey(decodedEscrowState.initializerTempTokenAccountPubkey).toBase58(),
//   //   initializerYTokenAccount: new PublicKey(decodedEscrowState.initializerReceivingTokenAccountPubkey).toBase58(),
//   //   expectedAmount: new BN(decodedEscrowState.expectedAmount, 10, "le").toNumber(),
//   // };
// };
//
// export const takeTrade = async (
//   privateKeyByteArray: string,
//   escrowAccountAddressString: string,
//   takerXTokenAccountAddressString: string,
//   takerYTokenAccountAddressString: string,
//   takerExpectedXTokenAmount: number,
//   programIdString: string
// ) => {
//   const takerAccount = new Account(privateKeyByteArray.split(",").map((s) => parseInt(s)));
//   const escrowAccountPubkey = new PublicKey(escrowAccountAddressString);
//   const takerXTokenAccountPubkey = new PublicKey(takerXTokenAccountAddressString);
//   const takerYTokenAccountPubkey = new PublicKey(takerYTokenAccountAddressString);
//   const programId = new PublicKey(programIdString);
//
//   let encodedEscrowState;
//   try {
//     encodedEscrowState = (await connection.getAccountInfo(escrowAccountPubkey, "singleGossip"))!.data;
//   } catch (err) {
//     throw new Error("Could not find escrow at given address!");
//   }
//   const decodedEscrowLayout = ESCROW_ACCOUNT_DATA_LAYOUT.decode(encodedEscrowState) as EscrowLayout;
//   const escrowState = {
//     escrowAccountPubkey: escrowAccountPubkey,
//     isInitialized: !!decodedEscrowLayout.isInitialized,
//     initializerAccountPubkey: new PublicKey(decodedEscrowLayout.initializerPubkey),
//     XTokenTempAccountPubkey: new PublicKey(decodedEscrowLayout.initializerTempTokenAccountPubkey),
//     initializerYTokenAccount: new PublicKey(decodedEscrowLayout.initializerReceivingTokenAccountPubkey),
//     expectedAmount: new BN(decodedEscrowLayout.expectedAmount, 10, "le"),
//   };
//
//   const PDA = await PublicKey.findProgramAddress([Buffer.from("escrow")], programId);
//
//   const exchangeInstruction = new TransactionInstruction({
//     programId,
//     data: Buffer.from(Uint8Array.of(1, ...new BN(takerExpectedXTokenAmount).toArray("le", 8))),
//     keys: [
//       { pubkey: takerAccount.publicKey, isSigner: true, isWritable: false },
//       { pubkey: takerYTokenAccountPubkey, isSigner: false, isWritable: true },
//       { pubkey: takerXTokenAccountPubkey, isSigner: false, isWritable: true },
//       { pubkey: escrowState.XTokenTempAccountPubkey, isSigner: false, isWritable: true },
//       { pubkey: escrowState.initializerAccountPubkey, isSigner: false, isWritable: true },
//       { pubkey: escrowState.initializerYTokenAccount, isSigner: false, isWritable: true },
//       { pubkey: escrowAccountPubkey, isSigner: false, isWritable: true },
//       { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
//       { pubkey: PDA[0], isSigner: false, isWritable: false },
//     ],
//   });
//
//   await connection.sendTransaction(new Transaction().add(exchangeInstruction), [takerAccount], {
//     skipPreflight: false,
//     preflightCommitment: "singleGossip",
//   });
// };
