import React from "react";

import { useEffect, useState } from "react";
import { fetchCategory } from "../../../hooks/fetchCategory";
const create = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    blogCategory: "",
  });
  const [isLoginMessage, setIsLoginMessage] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setToken(token);
      console.log(token);
    } else {
      setIsLoginMessage("Please login to create blog");
      setTimeout(() => {
        setIsLoginMessage("");
        window.location.href = "/auth/login";
      }, 2000);
    }
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      if (!token) {
        setIsLoginMessage("Please login to create blog");
        setTimeout(() => {
          setIsLoginMessage("");
        }, 3000);
        return;
      }
      const data = fetch(
        "https://buzzmash.onrender.com/api/v1/blog/create-blog",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            category: formData.blogCategory,
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        });
    } catch (err) {
      console.error(err.message);
    }
  };
  const { category } = fetchCategory();

  return (
    <div>
      <div className="w-full flex items-center justify-center">
        <div className="w-full max-w-lg">
          <form className=" px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="title"
              >
                Title
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="title"
                type="text"
                placeholder="Enter title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="description"
                placeholder="Enter description"
                rows="4"
                required
                name="description"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>
            <div className=" w-[150px]">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="blogCategory"
              >
                Category
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="blogCategory"
                type="text"
                placeholder="Enter category"
                name="blogCategory"
                required
                value={formData.blogCategory}
                onChange={handleChange}
              />
            </div>
            <p className="text-left m-1">Some famous category</p>
            <div className="flex items-center">
              {category.map((category) => (
                <p
                  className="p-1 bg-blue-200 mx-1 cursor-pointer rounded"
                  onClick={() => {
                    setFormData((prevState) => ({
                      ...prevState,
                      blogCategory: category.name,
                    }));
                  }}
                >
                  {category.name}
                </p>
              ))}
            </div>
            <div className="flex items-center justify-between my-1">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Submit
              </button>
              <p className="text-red-500">{isLoginMessage}</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default create;
