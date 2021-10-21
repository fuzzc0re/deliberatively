import { FC, ChangeEvent, createContext, useState, useEffect, useMemo, useCallback } from "react";
import { PublicKey } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useHistory, useLocation } from "react-router-dom";
import useLocalStorageState from "use-local-storage-state";

import { getAccountPDA, getContractPDA } from "../contract/utils";

import { IVoteMarket, getAllVoteMarkets, deleteVoteMarket, getOrSetVoteMarket } from "../models/VoteMarket";
import { IVoteParticipant, getAllVoteParticipants } from "../models/VoteParticipant";
import { IVoteAlternative, getAllVoteAlternatives } from "../models/VoteAlternative";

import { voteMarketAddressValidator } from "../utils/validators";
import { sha256 } from "../utils/db";

import { decodeVoteMarketState } from "../contract/state/VoteMarket";
import { decodeVoteParticipantState } from "../contract/state/voteParticipant";
import { Key } from "../contract/constants";

interface IVoteMarketContext {
  currentVoteMarket?: IVoteMarket;
  lastSelectedVoteMarketHash: string;
  isVoteParticipant: boolean;
  myPresentationText: string;
  setLastSelectedVoteMarketHash: (hash: string) => void;
  getAllVerifiedVoteMarkets: () => Promise<IVoteMarket[]>;
  getAssociatedVoteParticipants: (voteMarketAddress: string) => Promise<IVoteParticipant[]>;
  getAssociatedVoteAlternatives: (voteMarketAddress: string) => Promise<IVoteAlternative[]>;
  deleteVerifiedVoteMarket: (hash: string) => Promise<void>;
  setMyPresentationText: (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
}

const voteMarketContextDefaults: IVoteMarketContext = {
  currentVoteMarket: undefined,
  lastSelectedVoteMarketHash: "",
  isVoteParticipant: false,
  myPresentationText: "",
  setLastSelectedVoteMarketHash: (hash: string) => {
    console.log(hash);
    return;
  },
  getAllVerifiedVoteMarkets: async () => {
    const list: IVoteMarket[] = [];
    return list;
  },
  getAssociatedVoteParticipants: async (voteMarketAddress: string) => {
    console.log(voteMarketAddress);
    const list: IVoteParticipant[] = [];
    return list;
  },
  getAssociatedVoteAlternatives: async (voteMarketAddress: string) => {
    console.log(voteMarketAddress);
    const list: IVoteAlternative[] = [];
    return list;
  },
  deleteVerifiedVoteMarket: async (hash: string) => {
    console.log(hash);
    return;
  },
  setMyPresentationText: (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    console.log(event.target.value);
    return;
  },
};

export const VoteMarketContext = createContext<IVoteMarketContext>(voteMarketContextDefaults);

export const VoteMarketContextProvider: FC = ({ children }) => {
  const { connection } = useConnection();
  const { publicKey, connected, disconnecting } = useWallet();
  const [isVoteParticipant, setIsVoteParticipant] = useState(false);
  const [myPresentationText, setMyPresentationText] = useState("");
  const [currentVoteMarket, setCurrentVoteMarket] = useLocalStorageState(
    "currentVoteMarket",
    voteMarketContextDefaults.currentVoteMarket
  );
  const [lastSelectedVoteMarketHash, setLastSelectedVoteMarketHash] = useLocalStorageState(
    "lastSelectedVoteMarketHash",
    ""
  );

  const history = useHistory();
  const location = useLocation();

  const [basename, voteMarketAddress] = useMemo(
    () => [location.pathname.split(/[\\/]/)[1], location.pathname.split(/[\\/]/)[2]],
    [location.pathname]
  );

  const checkIsVoteParticipant = useCallback(async () => {
    if (currentVoteMarket && currentVoteMarket.address && publicKey) {
      try {
        const mintAccountPublicKey = new PublicKey(currentVoteMarket.address);
        const ownTokenAccountPDA = await getAccountPDA(mintAccountPublicKey, publicKey);
        const voteParticipantState = await decodeVoteParticipantState(connection, ownTokenAccountPDA);
        console.log(voteParticipantState);
        if (voteParticipantState.key === Key.VoteParticipant) {
          setIsVoteParticipant(true);
          setMyPresentationText(voteParticipantState.presentationText);
        }

        const programTokenAccountPDA = await getContractPDA(mintAccountPublicKey);
        const voteMarketState = await decodeVoteMarketState(connection, programTokenAccountPDA);
        console.log(voteMarketState);
      } catch (error) {
        console.log(error);
      }
    }
  }, [currentVoteMarket, publicKey, connection]);

  const checkVoteMarketAddress = useCallback(async () => {
    if (basename === "" || !voteMarketAddress || voteMarketAddress === "") return;
    // TODO Check first if valid address then if in db then solana
    const validated = await voteMarketAddressValidator(connection, voteMarketAddress);
    if (validated) {
      const hash = await sha256(voteMarketAddress);
      const voteMarket = await getOrSetVoteMarket(voteMarketAddress);
      setCurrentVoteMarket(voteMarket);
      setLastSelectedVoteMarketHash(hash);
    } else {
      history.replace("/market/invalid");
    }
  }, [basename, voteMarketAddress]);

  useEffect(() => {
    if (voteMarketAddress && voteMarketAddress !== "" && basename === "market") {
      checkVoteMarketAddress();
    }
  }, [basename, voteMarketAddress]);

  useEffect(() => {
    if (currentVoteMarket && currentVoteMarket.address !== "" && publicKey && connected) {
      checkIsVoteParticipant();
    }
  }, [currentVoteMarket, publicKey, connected]);

  useEffect(() => {
    if (disconnecting) {
      setIsVoteParticipant(false);
    }
  }, [disconnecting, setIsVoteParticipant]);

  useEffect(() => {
    if (voteMarketAddress === "") {
      setCurrentVoteMarket(undefined);
    }
  }, [voteMarketAddress, setCurrentVoteMarket]);

  // receives address and not hash since consumed by client
  const handleSetLastSelectedVoteMarketHash = useCallback(
    async (address: string) => {
      const hash = await sha256(address);
      setLastSelectedVoteMarketHash(hash);
    },
    [currentVoteMarket]
  );

  const handleSetMyPresentationText = useCallback(
    async (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      if (event.target.value) {
        setMyPresentationText(event.target.value);
      }
    },
    [currentVoteMarket, setMyPresentationText]
  );

  return (
    <VoteMarketContext.Provider
      value={{
        currentVoteMarket,
        lastSelectedVoteMarketHash,
        isVoteParticipant,
        myPresentationText,
        setLastSelectedVoteMarketHash: handleSetLastSelectedVoteMarketHash,
        getAllVerifiedVoteMarkets: getAllVoteMarkets,
        getAssociatedVoteParticipants: getAllVoteParticipants,
        getAssociatedVoteAlternatives: getAllVoteAlternatives,
        deleteVerifiedVoteMarket: deleteVoteMarket,
        setMyPresentationText: handleSetMyPresentationText,
      }}
    >
      {children}
    </VoteMarketContext.Provider>
  );
};
