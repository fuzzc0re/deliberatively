import { FC, MouseEventHandler } from "react";
import { Avatar, Button, ListItem, ListItemProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Wallet } from "@solana/wallet-adapter-wallets";

const StyledImg = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(3),
  height: theme.spacing(3),
}));

interface WalletIconProps {
  wallet: Wallet | null;
}

const WalletIcon: FC<WalletIconProps> = ({ wallet }) => {
  return wallet && <StyledImg src={wallet.icon} alt={`${wallet.name} icon`} />;
};

interface WalletListItemProps extends Omit<ListItemProps, "onClick" | "button"> {
  onClick: MouseEventHandler<HTMLButtonElement>;
  wallet: Wallet;
}

export const WalletListItem: FC<WalletListItemProps> = ({ onClick, wallet, ...props }) => {
  return (
    <ListItem {...props}>
      <Button onClick={onClick} endIcon={<WalletIcon wallet={wallet} />}>
        {wallet.name}
      </Button>
    </ListItem>
  );
};
