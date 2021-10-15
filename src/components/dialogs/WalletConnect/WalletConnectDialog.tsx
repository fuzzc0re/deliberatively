import { FC, Dispatch, ReactElement, SetStateAction, SyntheticEvent, useCallback, useMemo, useState } from "react";
import {
  Button,
  Collapse,
  Dialog,
  DialogContent,
  DialogProps,
  DialogTitle,
  IconButton,
  List,
  ListItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletName } from "@solana/wallet-adapter-wallets";
import { WalletListItem } from "./WalletListItem";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    width: theme.spacing(40),
    margin: 0,
  },
  "& .MuiDialogTitle-root": {
    backgroundColor: theme.palette.primary.main,
    "& .MuiTypography-root": {
      display: "flex",
      justifyContent: "space-between",
      lineHeight: theme.spacing(5) + "px",
    },
    "& .MuiIconButton-root": {
      flexShrink: 1,
      padding: theme.spacing(),
      marginRight: theme.spacing(-1),
      color: theme.palette.grey[500],
    },
  },
  "& .MuiDialogContent-root": {
    padding: 0,
    "& .MuiCollapse-root": {
      "& .MuiList-root": {
        background: theme.palette.grey[900],
      },
    },
    "& .MuiList-root": {
      background: theme.palette.grey[900],
      padding: 0,
    },
    "& .MuiListItem-root": {
      boxShadow: "inset 0 1px 0 0 " + "rgba(255, 255, 255, 0.1)",
      "&:hover": {
        boxShadow: "inset 0 1px 0 0 " + "rgba(255, 255, 255, 0.1)" + ", 0 1px 0 0 " + "rgba(255, 255, 255, 0.05)",
      },
      padding: 0,
      "& .MuiButton-endIcon": {
        margin: 0,
      },
      "& .MuiButton-root": {
        flexGrow: 1,
        justifyContent: "space-between",
        padding: theme.spacing(1, 3),
        borderRadius: undefined,
        fontSize: "1rem",
        fontWeight: 400,
      },
      "& .MuiSvgIcon-root": {
        color: theme.palette.grey[500],
      },
    },
  },
}));

export interface WalletDialogProps extends Omit<DialogProps, "title" | "open"> {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  featuredWallets?: number;
  title?: ReactElement;
}

export const WalletConnectDialog: FC<WalletDialogProps> = ({
  open,
  setOpen,
  title = "Select your wallet",
  featuredWallets = 3,
  onClose,
  ...props
}) => {
  const { wallets, select } = useWallet();
  const [expanded, setExpanded] = useState(false);

  const [featured, more] = useMemo(
    () => [wallets.slice(0, featuredWallets), wallets.slice(featuredWallets)],
    [wallets, featuredWallets]
  );

  const handleClose = useCallback(
    (event: SyntheticEvent, reason?: "backdropClick" | "escapeKeyDown") => {
      if (onClose) onClose(event, reason ? reason : "backdropClick");
      if (!event.defaultPrevented) setOpen(false);
    },
    [setOpen, onClose]
  );

  const handleWalletClick = useCallback(
    (event: SyntheticEvent, walletName: WalletName) => {
      select(walletName);
      handleClose(event);
    },
    [select, handleClose]
  );

  const handleExpandClick = useCallback(() => setExpanded(!expanded), [setExpanded, expanded]);

  return (
    <StyledDialog open={open} onClose={handleClose} {...props}>
      <DialogTitle>
        {title}
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <List>
          {featured.map((wallet) => (
            <WalletListItem
              key={wallet.name}
              onClick={(event) => handleWalletClick(event, wallet.name)}
              wallet={wallet}
            />
          ))}
          {more.length ? (
            <>
              <Collapse in={expanded} timeout="auto" unmountOnExit>
                <List>
                  {more.map((wallet) => (
                    <WalletListItem
                      key={wallet.name}
                      onClick={(event) => handleWalletClick(event, wallet.name)}
                      wallet={wallet}
                    />
                  ))}
                </List>
              </Collapse>
              <ListItem>
                <Button onClick={handleExpandClick}>
                  {expanded ? "Less" : "More"} options
                  {expanded ? <ExpandLess /> : <ExpandMore />}
                </Button>
              </ListItem>
            </>
          ) : null}
        </List>
      </DialogContent>
    </StyledDialog>
  );
};
