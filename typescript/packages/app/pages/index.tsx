import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";

export default function Home() {
  const [copy, setCopy] = useState("");

  useEffect(() => {
    async function f() {
      const res = await fetch(`https://jsonplaceholder.typicode.com/posts/1`);
      await res.json();
      setCopy("hi");
    }
    f();
  });
  return (
    <div className={styles["container"]}>
      <Head>
        <title>Welcome to Songbird Therapy</title>
        <div>Welcome to Songbird Therapy</div>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles["main"]}>
        <h1 className={styles["title"]}>{copy}</h1>
      </main>
    </div>
  );
}
