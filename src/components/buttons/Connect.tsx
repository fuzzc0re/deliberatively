import { FC, useState, useMemo, useCallback, MouseEventHandler } from "react";
import { Button, Tooltip } from "@mui/material";
import { styled } from "@mui/material/styles";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import {
  useWallet,
  // useConnection
} from "@solana/wallet-adapter-react";

import { WalletConnectDialog } from "../dialogs/WalletConnect/WalletConnectDialog";

const StyledButton = styled(Button)(({ theme }) => ({
  position: "relative",
  marginRight: theme.spacing(1),
  color: theme.palette.primary.contrastText,
}));

export const ConnectButton: FC = () => {
  const { wallet, publicKey, connect, connecting, disconnect, disconnecting } = useWallet();
  // const { connection } = useConnection();
  const [openModal, setOpenModal] = useState(false);

  const bulletColor = useMemo(() => {
    if (connecting || disconnecting) {
      return "yellow";
    } else if (publicKey) {
      // (async () => {
      //   const balance = await connection.getBalance(publicKey);
      //   console.log(balance);
      // })();
      return "green";
    } else {
      return "red";
    }
  }, [publicKey, connecting, disconnecting]);

  const buttonText = useMemo(() => {
    if (publicKey && !connecting) {
      const base58 = publicKey.toBase58();
      const stringToReplace = base58.slice(3, base58.length - 3);
      return base58.replace(stringToReplace, "...");
    } else if (connecting) {
      return "Connecting";
    } else {
      return "Connect";
    }
  }, [publicKey, connecting]);

  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    async (event) => {
      if (!event.defaultPrevented) {
        if (publicKey) {
          try {
            await disconnect();
          } catch (error) {
            console.log(error);
          }
        } else {
          if (!wallet) {
            try {
              setOpenModal(!openModal);
            } catch (error) {
              console.log(error);
            }
          } else {
            try {
              await connect();
            } catch (error) {
              console.log(error);
            }
          }
        }
      }
    },
    [connect, disconnect, publicKey, openModal, setOpenModal]
  );

  return (
    <div>
      <Tooltip title={publicKey ? "Wallet connected" : "Wallet disconnected"}>
        <StyledButton
          variant="outlined"
          startIcon={<FiberManualRecordIcon style={{ color: bulletColor }} />}
          disableRipple
          onClick={handleClick}
        >
          {buttonText}
        </StyledButton>
      </Tooltip>
      <WalletConnectDialog open={openModal} setOpen={setOpenModal} title={<div>"Connect wallet"</div>} />
    </div>
  );
};
