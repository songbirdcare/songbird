import Head from "next/head";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";

import * as React from "react";

import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";

import { useUser } from "@auth0/nextjs-auth0/client";
import Image from "next/image";

export default withPageAuthRequired(function Home() {
  const { user } = useUser();

  return (
    <div>
      <Head>
        <title>Songbird Therapy</title>
        <meta name="description" content="Innovative care" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box>
        <AppBar
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
            <Box
              gridArea="1 / 2 / 2 / 4"
              display="flex"
              justifyContent="center"
            >
              <Image
                src="/songbird-logo.svg"
                alt="me"
                width="128"
                height="64"
              />
            </Box>

            <Box
              gridArea="1 / 4 / 2 / 5"
              display="flex"
              justifyContent="flex-end"
              marginRight={2}
            >
              {user && <Typography color={"black"}>{user.name}</Typography>}
            </Box>
          </Toolbar>
          <Box></Box>
        </AppBar>
      </Box>
    </div>
  );
});
