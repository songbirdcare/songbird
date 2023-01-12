import { ArrowRight } from "@mui/icons-material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { IconButton } from "@mui/material";
import { default as MuiAppBar } from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { useRouter } from "next/router";
import * as React from "react";

import { useDeleteWorkflows } from "../hooks/use-delete-workflows";
import { useFetchUser } from "../hooks/use-fetch-user";
import { useFetchWorkflow } from "../hooks/use-fetch-workflow";
import { SETTINGS } from "../settings";
import { SONG_BIRD_GREEN } from "../style/colors";

export const AppBar: React.FC = () => {
  const { data: user } = useFetchUser();
  return <AppBarBody displayName={user?.name ?? user?.email} />;
};

export const AppBarBody: React.FC<{
  displayName: string | undefined;
}> = ({ displayName }) => {
  return (
    <MuiAppBar
      position="sticky"
      sx={{
        bgcolor: "white",
        paddingLeft: "0",
        paddingRight: "0",
        top: 0,
        zIndex: 100,
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gridTemplateRows: "1fr",
          gridColumnGap: "0px",
          gridrowGap: "0px",
        }}
      >
        <Box gridArea="1 / 2 / 2 / 4" display="flex" justifyContent="center">
          <Link href="/" underline="none">
            <Image src="/songbird-logo.svg" alt="me" width="128" height="64" />
          </Link>
        </Box>

        <Box
          gridArea="1 / 4 / 2 / 5"
          display="flex"
          justifyContent="flex-end"
          marginRight={2}
          alignItems="center"
        >
          <Box>
            {displayName && (
              <Typography color={"black"}>{displayName}</Typography>
            )}
          </Box>

          <FadeMenu />
        </Box>
      </Toolbar>
    </MuiAppBar>
  );
};

const FadeMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const { trigger, isMutating } = useDeleteWorkflows();
  const { mutate } = useFetchWorkflow();

  const router = useRouter();
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        id="fade-button"
        aria-controls={open ? "fade-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        {open ? (
          <ArrowRight sx={{ color: SONG_BIRD_GREEN }} />
        ) : (
          <ArrowDropDownIcon sx={{ color: SONG_BIRD_GREEN }} />
        )}
      </IconButton>
      <Menu
        id="fade-menu"
        MenuListProps={{
          "aria-labelledby": "fade-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem
          dense
          onClick={() => {
            router.push("/api/auth/logout");
            handleClose();
          }}
        >
          Logout
        </MenuItem>
        {SETTINGS.enableDebuggingAction && (
          <MenuItem
            dense
            onClick={() => {
              trigger();
              mutate();
              handleClose();
            }}
            disabled={isMutating}
          >
            Reset workflow
          </MenuItem>
        )}
      </Menu>
    </div>
  );
};
