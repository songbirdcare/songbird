import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";

//const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT as string;

export default function Home() {
  const [copy] = useState("");

  //useEffect(() => {
  //async function f() {
  //const res = await fetch(API_ENDPOINT);
  //setCopy(await res.text());
  //}
  //f();
  //}, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Songbird Therapy</title>
        <meta name="description" content="Innovative care" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>{copy}</h1>
      </main>
    </div>
  );
}
