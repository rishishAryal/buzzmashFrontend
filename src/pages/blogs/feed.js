import React from "react";
import { useEffect, useState } from "react";
import { fetchCategory } from "../../../hooks/fetchCategory";
const feed = () => {
  const [blogFeed, setBlogFeed] = useState([]);

  const { category } = fetchCategory();

  const [token, setToken] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    blogCategory: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit =  (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (token) {
        setToken(token);
        console.log(token);
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

  useEffect(() => {
    const response = fetch(
      "https://buzzmash.onrender.com/api/v1/blog/getBlogFeed",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setBlogFeed(data.blogs);
        console.log(data.blogs);
      });
  }, []);

  return (
    <div>
      <div className="text-center w-full">
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
              </div>
            </form>
          </div>
        </div>
        {/* feed start here */}
        <hr></hr>
        <h1 className="text-4xl m-[50px]"> Blog Feed</h1>

        {blogFeed.map((blog) => (
          <div className="w-[500px] p-[20px] rounded-sm border mx-auto mt-4">
            <div className="">
              <p className="text-sm text-left ">By : {blog.author}</p>
              <div className="flex justify-between items-center">
                <h1 className="text-2xl text-left font-semibold ">
                  {blog.title}
                </h1>

                <p className="p-1 bg-blue-200 rounded">{blog.category}</p>
              </div>

              <p className="text-justify">
                {blog.description.length > 150
                  ? blog.description.substring(0, 150) + "...."
                  : ""}
              </p>
              <hr className="mt-4"></hr>
              <div className="flex justify-between items-center">
                <p>Like {blog.likeCount}</p>
                <p>Comment {blog.commentCount}</p>
              </div>
            </div>
          </div>
        ))}

        {/* <div className="w-[400px] p-[20px] rounded-sm border mx-auto mt-4">
          <div>
            <h1 className="text-2xl text-left font-semibold ">Title</h1>
            <p className="text-justify">
              lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <hr className="mt-4"></hr>
            <div className="flex justify-between items-center">
              <p>Like {0}</p>
              <p>Comment {0}</p>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default feed;
