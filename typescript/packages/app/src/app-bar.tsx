import * as React from "react";

import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { default as MuiAppBar } from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";

import Image from "next/image";

interface Props {
  displayName: string | undefined;
}

export const AppBar: React.FC<Props> = ({ displayName }) => (
  <MuiAppBar
    position="static"
    sx={{ bgcolor: "white", paddingLeft: "0", paddingRight: "0" }}
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
        <Image src="/songbird-logo.svg" alt="me" width="128" height="64" />
      </Box>

      <Box
        gridArea="1 / 4 / 2 / 5"
        display="flex"
        justifyContent="flex-end"
        marginRight={2}
      >
        <Box>
          {displayName && (
            <Typography color={"black"}>{displayName}</Typography>
          )}
          <Link href="/api/auth/logout" variant="body2">
            Logout
          </Link>
        </Box>
      </Box>
    </Toolbar>
  </MuiAppBar>
);
