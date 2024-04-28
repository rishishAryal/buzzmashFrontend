import "@/styles/globals.css";
import Navbar from "../../components/Navbar";
import { useEffect, useState } from "react";
export default function App({ Component, pageProps }) {
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  useEffect(() => {
    if (typeof localStorage !== "undefined") {
      setToken(localStorage.getItem("token"));
      setUsername(localStorage.getItem("username"));
    } else {
      setToken("");
      setUsername("");
    }
  }, []);
  return (
    <>
      <Navbar token={token} username={username} />
      <Component {...pageProps} />
    </>
  );
}
