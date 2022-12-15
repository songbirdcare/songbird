import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";

import { useUser } from "@auth0/nextjs-auth0/client";

export default function Home() {
  const [copy, setCopy] = useState("NO AUTH");

  const { user } = useUser();

  useEffect(() => {
    if (!user) {
      return;
    }
    async function f() {
      const res = await fetch("/api/proxy");
      const json = await res.json();
      setCopy(json.count);
    }
    f();
  }, [user]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Songbird Therapy</title>
        <meta name="description" content="Innovative care" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {user ? (
        <a href="/api/auth/logout">Logout</a>
      ) : (
        <a href="/api/auth/login">Login</a>
      )}

      <Profile />

      <main className={styles.main}>
        <h1 className={styles.title}>{copy}</h1>
      </main>
    </div>
  );
}

const Profile: React.FunctionComponent = () => {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  if (!user) {
    return null;
  }

  return (
    user && (
      <div>
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </div>
    )
  );
};
