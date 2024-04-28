import { useState, useEffect } from "react";

const fetchCategory = () => {
  const [category, setCategory] = useState([]);

  useEffect(() => {
    const fetchBlogCategory = async () => {
      const response = await fetch(
        "https://buzzmash.onrender.com/api/v1/blog/getCategory",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data.categories);
          setCategory(data.categories);
        });
    };
    fetchBlogCategory();
  }, []);

  return { category };
};

export { fetchCategory };
