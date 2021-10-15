import { FC } from "react";
import { useHistory } from "react-router-dom";
import { ListItemText, ListItemAvatar, ListItemButton, Avatar, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/DeleteSharp";
import FolderIcon from "@mui/icons-material/Folder";

import { IVoteMarket, deleteVoteMarket } from "../../models/VoteMarket";
import { useVoteMarketContext } from "../../hooks/useVoteMarketContext";

import { StyledListItem } from "../styled/ListItem";

interface GoToVoteMarketProps {
  voteMarket: IVoteMarket;
}

export const GoToVoteMarket: FC<GoToVoteMarketProps> = ({ voteMarket }) => {
  const history = useHistory();
  const { lastSelectedVoteMarketHash, setLastSelectedVoteMarketHash } = useVoteMarketContext();

  const handleClick = () => {
    setLastSelectedVoteMarketHash(voteMarket.address);
    history.push(`/vote/${voteMarket.address}`);
  };

  const handleDeleteClick = async () => {
    setLastSelectedVoteMarketHash("");
    await deleteVoteMarket(voteMarket.hash);
  };

  return (
    <StyledListItem
      secondaryAction={
        <IconButton edge="end" aria-label="delete vote market" onClick={handleDeleteClick}>
          <DeleteIcon />
        </IconButton>
      }
    >
      <ListItemButton onClick={handleClick} selected={lastSelectedVoteMarketHash === voteMarket.hash}>
        <ListItemAvatar>
          <Avatar>
            <FolderIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={voteMarket.address} secondary={voteMarket.startDate} />
      </ListItemButton>
    </StyledListItem>
  );
};
