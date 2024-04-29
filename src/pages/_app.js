import "@/styles/globals.css";
import Navbar from "../../components/Navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
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
  // call function when ever uri change
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = () => {
      fetch("https://buzzmash.onrender.com/api/v1/user/refresh-token", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (!data.login) {
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            // router.push("/auth/login");
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          localStorage.removeItem("token");``
          localStorage.removeItem("username");
          router.push("/auth/login");
        });
    };

    // Listen to route changes
    router.events.on("routeChangeComplete", handleRouteChange);

    // Cleanup function
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router, token]);

  return (
    <>
      <Navbar token={token} username={username} />
      <Component {...pageProps} />
    </>
  );
}
