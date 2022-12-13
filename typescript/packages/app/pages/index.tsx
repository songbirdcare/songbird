import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles["container"]}>
      <Head>
        <title>Welcome to Songbird Therapy</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles["main"]}>
        <h1 className={styles["title"]}>Welcome to Songbird</h1>
      </main>
    </div>
  );
}
