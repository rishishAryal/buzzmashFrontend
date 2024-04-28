let token;

if (typeof localStorage !== "undefined") {
  token = localStorage.getItem("token");
} else {
  // Handle the case where localStorage is not available
  token = null; // Or any other default value
}

export default token;
