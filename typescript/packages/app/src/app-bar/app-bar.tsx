import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { Avatar, IconButton } from "@mui/material";
import { default as MuiAppBar } from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import type { UserModel } from "@songbird/precedent-iso";
import Image from "next/image";
import { useRouter } from "next/router";
import * as React from "react";
import { useIntercom } from "react-use-intercom";

import { useDeleteWorkflows } from "../hooks/use-delete-workflows";
import { useFetchUser } from "../hooks/use-fetch-user";
import { useFetchWorkflow } from "../hooks/use-fetch-workflow";
import { SETTINGS } from "../settings";
import { SONG_BIRD_GREEN_LIGHT } from "../style/colors";
import { TRACKER } from "../track";
import styles from "./app-bar.module.css";

export const AppBar: React.FC = () => {
  const { data: user } = useFetchUser();

  const avatarDisplayName = getAvatarDisplayName(user);
  const { boot } = useIntercom();

  React.useEffect(() => {
    if (!user) {
      return;
    }
    TRACKER.setUserId(user.id);

    boot({
      email: user.email,
      userId: user.id,
      name: user.givenName ?? user.email,
    });
  }, [boot, user]);

  return <AppBarBody displayName={avatarDisplayName} />;
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
        boxShadow:
          "rgb(0 0 0 / 20%) 0px 0 0 0, inset rgb(0 0 0 / 14%) 0px 0px 0px 0px, rgb(0 0 0 / 12%) 0px 1px 5px 0px",
      }}
      elevation={0}
    >
      <Toolbar disableGutters>
        <Box
          width="100%"
          display="grid"
          className={styles["toolbar"] as string}
        >
          <Box
            className={styles["logo"] as string}
            display="flex"
            justifyContent="center"
          >
            <Link href="/" underline="none">
              <Image
                src="/songbird-logo.svg"
                alt="me"
                width="128"
                height="64"
              />
            </Link>
          </Box>

          <Box
            className={styles["right-side"] as string}
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
          >
            <Box className={styles["display-name"] as string}>
              {displayName && (
                <Avatar
                  sx={{
                    bgcolor: SONG_BIRD_GREEN_LIGHT,
                    color: "black",
                  }}
                >
                  <Typography>{displayName}</Typography>
                </Avatar>
              )}
            </Box>

            <FadeMenu />
          </Box>
        </Box>
      </Toolbar>
    </MuiAppBar>
  );
};

const FadeMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const { show, shutdown } = useIntercom();
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
        color="primary"
        className={styles["arrow-button"] as string}
      >
        {open ? (
          <ArrowDropUpIcon color="inherit" />
        ) : (
          <ArrowDropDownIcon color="inherit" />
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
            shutdown();
            handleClose();
          }}
        >
          <Box display="flex" justifyContent="center" width="100%">
            <Typography color="primary" variant="body2">
              Logout
            </Typography>
          </Box>
        </MenuItem>

        <MenuItem
          dense
          onClick={() => {
            show();
            handleClose();
          }}
        >
          <Box display="flex" justifyContent="center" width="100%">
            <Typography color="primary" variant="body2">
              Live chat
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem>
          <Link
            href="/feedback"
            sx={{
              textDecoration: "none",
            }}
          >
            <Typography color="primary" variant="body2">
              Offer feedback
            </Typography>
          </Link>
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
            color="primary"
          >
            <Box display="flex" justifyContent="center" width="100%">
              <Typography color="primary" variant="body2">
                Reset workflow
              </Typography>
            </Box>
          </MenuItem>
        )}
      </Menu>
    </div>
  );
};
function getAvatarDisplayName(user: UserModel | undefined) {
  if (!user) {
    return undefined;
  }
  if (user.givenName && user.familyName) {
    return `${user.givenName.at(0)?.toUpperCase()}${user.familyName
      .at(0)
      ?.toUpperCase()}`;
  }
  return user.email.at(0)?.toUpperCase();
}
