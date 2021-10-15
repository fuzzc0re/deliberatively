import { FC, createContext, useEffect, useMemo, useCallback } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { useHistory, useLocation } from "react-router-dom";
import useLocalStorageState from "use-local-storage-state";

import { IVoteMarket, getAllVoteMarkets, deleteVoteMarket, getOrSetVoteMarket } from "../models/VoteMarket";
import { IVoteParticipant, getAllVoteParticipants } from "../models/VoteParticipant";
import { IVoteAlternative, getAllVoteAlternatives } from "../models/VoteAlternative";

import { voteMarketAddressValidator } from "../utils/validators";
import { sha256 } from "../utils/db";

interface IVoteMarketContext {
  currentVoteMarket?: IVoteMarket;
  lastSelectedVoteMarketHash: string;
  setLastSelectedVoteMarketHash: (hash: string) => void;
  getAllVerifiedVoteMarkets: () => Promise<IVoteMarket[]>;
  getAssociatedVoteParticipants: (voteMarketAddress: string) => Promise<IVoteParticipant[]>;
  getAssociatedVoteAlternatives: (voteMarketAddress: string) => Promise<IVoteAlternative[]>;
  deleteVerifiedVoteMarket: (hash: string) => Promise<void>;
}

const voteMarketContextDefaults: IVoteMarketContext = {
  currentVoteMarket: undefined,
  lastSelectedVoteMarketHash: "",
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
};

export const VoteMarketContext = createContext<IVoteMarketContext>(voteMarketContextDefaults);

export const VoteMarketContextProvider: FC = ({ children }) => {
  const { connection } = useConnection();
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

  const checkVoteMarketAddress = useCallback(async () => {
    if (!voteMarketAddress || voteMarketAddress === "") return;
    // TODO Check first if valid address then if in db then solana
    const validated = await voteMarketAddressValidator(connection, voteMarketAddress);
    if (validated) {
      const hash = await sha256(voteMarketAddress);
      const voteMarket = await getOrSetVoteMarket(voteMarketAddress);
      setCurrentVoteMarket(voteMarket);
      setLastSelectedVoteMarketHash(hash);
    } else {
      history.replace("/invalid-vote-market-address");
    }
  }, [location.pathname]);

  useEffect(() => {
    if (
      voteMarketAddress &&
      voteMarketAddress !== "" &&
      basename === "market" // || basename === "participate" || basename === "contribute")
    ) {
      checkVoteMarketAddress();
    }
  }, [location.pathname]);

  // receives address and not hash since consumed by client
  const handleSetLastSelectedVoteMarketHash = useCallback(
    async (address: string) => {
      const hash = await sha256(address);
      setLastSelectedVoteMarketHash(hash);
    },
    [location.pathname]
  );

  return (
    <VoteMarketContext.Provider
      value={{
        currentVoteMarket,
        lastSelectedVoteMarketHash,
        setLastSelectedVoteMarketHash: handleSetLastSelectedVoteMarketHash,
        getAllVerifiedVoteMarkets: getAllVoteMarkets,
        getAssociatedVoteParticipants: getAllVoteParticipants,
        getAssociatedVoteAlternatives: getAllVoteAlternatives,
        deleteVerifiedVoteMarket: deleteVoteMarket,
      }}
    >
      {children}
    </VoteMarketContext.Provider>
  );
};
