import { FC, ChangeEvent, createContext, useState, useEffect, useMemo, useCallback } from "react";
import {
  // Signer
  PublicKey,
} from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useHistory, useLocation } from "react-router-dom";

import { useStorageState } from "../hooks/useStorageState";

import { IVoteMarket, getAllVoteMarkets, deleteVoteMarket, getOrSetVoteMarket } from "../models/VoteMarket";
import { IVoteParticipant, getAllVoteParticipants } from "../models/VoteParticipant";
import { IVoteAlternative, getAllVoteAlternatives } from "../models/VoteAlternative";

import { voteMarketAddressValidator } from "../utils/validators";
import { sha256 } from "../utils/db";

// import { decodeVoteMarketState } from "../contract/state/VoteMarket";
import { decodeVoteParticipantState } from "../contract/state/voteParticipant";
import { Key } from "../contract/constants";
import {
  // convertBase64URLToKeypair,
  getAccountPDA,
  // getContractPDA,
} from "../contract/utils";

interface IVoteMarketContext {
  // mintKeypair?: Signer;
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

const defaultVoteMarket: IVoteMarket = {
  address: "",
  hash: "",
  pda: "",
  identifierText: "",
  numberOfParticipants: 0,
  maxRepresentatives: 0,
  startDate: Date.now(),
  stopDate: Date.now(),
  minimumContributionRequiredFromParticipant: 0,
  participants: [],
  alternatives: [],
};

const voteMarketContextDefaults: IVoteMarketContext = {
  // mintKeypair: undefined,
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
  const [addressIsValid, setAddressIsValid] = useState(false);
  const [isVoteParticipant, setIsVoteParticipant] = useState(false);
  const [myPresentationText, setMyPresentationText] = useState("");
  const [currentVoteMarket, setCurrentVoteMarket] = useStorageState("currentVoteMarket", defaultVoteMarket);
  const [lastSelectedVoteMarketHash, setLastSelectedVoteMarketHash] = useStorageState("lastSelectedVoteMarketHash", "");

  const history = useHistory();
  const location = useLocation();

  const [basename, voteMarketAddress, extraPath] = useMemo(() => {
    const paths = location.pathname.split(/[\\/]/);
    if (paths[3]) {
      return [paths[1], paths[2], paths[3]];
    } else {
      return [paths[1], paths[2]];
    }
  }, [location.pathname]);

  const voteMarketAddressLengthGreaterThanZero = useMemo(() => {
    if (voteMarketAddress && voteMarketAddress !== "" && voteMarketAddress.length > 0) {
      return true;
    } else {
      return false;
    }
  }, [basename, voteMarketAddress]);

  const basenameIsMarket = useMemo(() => {
    if (basename && basename === "market") {
      return true;
    } else {
      return false;
    }
  }, [basename]);

  const mintAccountPublicKey = useMemo(() => {
    if (basenameIsMarket && voteMarketAddressLengthGreaterThanZero && addressIsValid) {
      return new PublicKey(voteMarketAddress);
    }
  }, [basename, voteMarketAddress, addressIsValid]);

  // const mintKeypair = useMemo(() => {
  //   if (basenameIsMarket && voteMarketAddressLengthGreaterThanZero && addressIsValid) {
  //     try {
  //       return convertBase64URLToKeypair(voteMarketAddress);
  //     } catch {
  //       return undefined;
  //     }
  //   }
  // }, [basename, voteMarketAddress, addressIsValid]);

  const checkIsVoteParticipant = useCallback(async () => {
    if (publicKey && connected && addressIsValid && currentVoteMarket && mintAccountPublicKey) {
      try {
        const ownTokenAccountPDA = await getAccountPDA(mintAccountPublicKey, publicKey);
        const voteParticipantState = await decodeVoteParticipantState(connection, ownTokenAccountPDA);
        // console.log(voteParticipantState);
        if (voteParticipantState.key === Key.VoteParticipant) {
          setIsVoteParticipant(true);
          setMyPresentationText(voteParticipantState.presentationText);
        }

        // const programTokenAccountPDA = await getContractPDA(mintAccountPublicKey);
        // const voteMarketState = await decodeVoteMarketState(connection, programTokenAccountPDA);
        // console.log(voteMarketState);
      } catch (error) {
        console.log(error);
      }
    }
  }, [
    publicKey,
    connected,
    extraPath,
    addressIsValid,
    currentVoteMarket,
    mintAccountPublicKey,
    setIsVoteParticipant,
    setMyPresentationText,
  ]);

  const checkVoteMarketAddress = useCallback(async () => {
    if (!basenameIsMarket || !voteMarketAddressLengthGreaterThanZero) return;
    const validated = await voteMarketAddressValidator(connection, voteMarketAddress);
    if (validated) {
      const voteMarket = await getOrSetVoteMarket(connection, voteMarketAddress);
      setAddressIsValid(true);
      setCurrentVoteMarket(voteMarket);
      setLastSelectedVoteMarketHash(voteMarket.hash);
    } else {
      setAddressIsValid(false);
      setCurrentVoteMarket(defaultVoteMarket);
      history.replace("/market/invalid");
    }
  }, [basename, voteMarketAddress, setAddressIsValid, setCurrentVoteMarket, setLastSelectedVoteMarketHash]);

  useEffect(() => {
    if (publicKey && connected && currentVoteMarket) {
      checkIsVoteParticipant();
    }
  }, [publicKey, connected, currentVoteMarket, extraPath]);

  useEffect(() => {
    if (basenameIsMarket && voteMarketAddressLengthGreaterThanZero) {
      checkVoteMarketAddress();
    }
  }, [basename, voteMarketAddress]);

  useEffect(() => {
    if (disconnecting || !connected) {
      setIsVoteParticipant(false);
    }
  }, [disconnecting, connected, setIsVoteParticipant]);

  // receives address and not hash since consumed by client
  const handleSetLastSelectedVoteMarketHash = useCallback(
    async (address: string) => {
      const hash = await sha256(address);
      setLastSelectedVoteMarketHash(hash);
    },
    [setLastSelectedVoteMarketHash]
  );

  const handleSetMyPresentationText = useCallback(
    async (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      if (event.target.value) {
        setMyPresentationText(event.target.value);
      }
    },
    [setMyPresentationText]
  );

  return (
    <VoteMarketContext.Provider
      value={{
        // mintKeypair,
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
