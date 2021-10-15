import { FC } from "react";
// import { PublicKey } from "@solana/web3.js";
// import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
// import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import { StyledButton } from "../styled/Button";

export const SearchButton: FC = () => {
  // const { connection } = useConnection();
  // const { publicKey } = useWallet();

  const handleClick = async () => {
    console.log("Search...");

    // Construct my token class
    // const myMint = new PublicKey("My Mint Public Address");
    // const myToken = new Token(connection, myMint, TOKEN_PROGRAM_ID, fromWallet);
    // // Create associated token accounts for my token if they don't exist yet
    // const myTokenAccount = await myToken.getOrCreateAssociatedAccountInfo(publicKey);
  };

  return <StyledButton onClick={handleClick}>Search</StyledButton>;
};
