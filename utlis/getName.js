

let username;

if (typeof localStorage !== "undefined") {
  name = localStorage.getItem("username");
} else {
  username = "";
}

export default username;
