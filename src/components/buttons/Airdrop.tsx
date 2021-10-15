import { FC, useCallback } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, TransactionSignature } from "@solana/web3.js";

import { StyledButton } from "../styled/Button";

export const AirdropButton: FC = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  const handleClick = useCallback(async () => {
    if (!publicKey) {
      console.log("Wallet not connected!");
      return;
    }

    let signature: TransactionSignature = "";
    try {
      signature = await connection.requestAirdrop(publicKey, LAMPORTS_PER_SOL);
      console.log("Airdrop requested:", signature);

      await connection.confirmTransaction(signature, "processed");
      console.log("Airdrop successful!", signature);
    } catch (error) {
      console.log(`Airdrop failed! ${error}`, signature);
    }
  }, [publicKey, connection]);

  return (
    <StyledButton disabled={!publicKey} onClick={handleClick}>
      Airdrop
    </StyledButton>
  );
};
