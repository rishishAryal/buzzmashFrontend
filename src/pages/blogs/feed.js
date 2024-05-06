import React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchCategory } from "../../../hooks/fetchCategory";
const feed = () => {
  const [blogFeed, setBlogFeed] = useState([]);

  const { category } = fetchCategory();

  const [token, setToken] = useState("");
  const [isLoginMessage, setIsLoginMessage] = useState("");
  const [blogId, setBlogId] = useState("");
  const [blogIdofLike, setblogIdofLike] = useState("");
  const [isLikePressed, setIsLikePressed] = useState(false);
  const [isCommentLoading, setIsCommentLoading] = useState(false);
  const [commentData, setCommentData] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    blogCategory: "",
  });

  const [openComment, setOpenComment] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setToken(token);
      console.log(token);
    }
  }, []);

  const likeBlogId = (id) => {
    setblogIdofLike(id);
  };

  useEffect(() => {
    if (blogIdofLike) {
      like();
    }
  }, [blogIdofLike]);

  const like = async () => {
    if (!token) {
      setTimeout(() => {
        window.location.href = "/auth/login";
      }, 1000);
      return;
    }

    const response = fetch("https://buzzmash.onrender.com/api/v1/blog/like", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        blogId: blogIdofLike,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          window.location.reload();
        }
        console.log(blogId);
      });
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
          if (data.success) {
            window.location.reload();
          }
        });
    } catch (err) {
      console.error(err.message);
    }
  };

  const submitComment = (e) => {
    e.preventDefault();

    if (!token) {
      setIsLoginMessage("Please login to create blog");
      setTimeout(() => {
        setIsLoginMessage("");
      }, 3000);
      return;
    }
    console.log(commentText, blogId);
    const data = fetch("https://buzzmash.onrender.com/api/v1/blog/comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        blogId: blogId,
        comment: commentText,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          fetchComment();
          setCommentText("");
        }
      })
      .catch((err) => {
        console.error(err.message);
      });
  };

  const blogByCategory = (category) => {
    setSelectedCategory(category);

    setBlogFeed([]);
    const response = fetch(
      "https://buzzmash.onrender.com/api/v1/blog/getBlogByCategory",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: category,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setBlogFeed(data.blogs);
        console.log(data.blogs);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    if (blogId) {
      fetchComment();
    }
  }, [blogId]); // This effect runs whenever blogId changes

  const fetchComment = () => {
    try {
      setIsCommentLoading(true);
      fetch(`https://buzzmash.onrender.com/api/v1/blog/getComments/${blogId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            console.log(data.comments);
            setCommentData(data.comments);
          }
          if (commentData.length > 0) {
            setIsCommentLoading(false);
          }

          setIsCommentLoading(false);
        })
        .catch((err) => {
          console.log(err.message);
        });
    } catch (err) {
      console.error(err);
      setIsCommentLoading(false);
    }
  };

  const setComment = (id) => {
    setBlogId(id);
    setOpenComment(true);
  };
  const unsetComment = () => {
    setOpenComment(false);
    setBlogId("");
  };

  const fetchAllBlog = () => {
    setSelectedCategory("All");
    setBlogFeed([]);
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
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    fetchAllBlog();
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
        {/* feed start here */}
        <hr></hr>
        <h1 className="text-4xl m-[50px]"> Blog Feed</h1>
        {/* sort in ascending order */}
        <div className="mx-auto w-[500px]">
          <h1>Browse by Category</h1>
          <div className="flex items-center overflow-scroll">
            <p
              // className="p-1 bg-blue-200 mx-1 cursor-pointer rounded"
              className={
                selectedCategory === "All"
                  ? "bg-blue-400 p-1 mx-1 text-white cursor-pointer rounded"
                  : "p-1 mx-1 bg-blue-200 cursor-pointer rounded"
              }
              onClick={() => {
                fetchAllBlog();
              }}
            >
              All
            </p>
            {category.map((category) => (
              <p
                // className="p-1 bg-blue-200 mx-1 cursor-pointer rounded"
                className={
                  selectedCategory === category.name
                    ? "bg-blue-400 p-1 mx-1 text-white cursor-pointer rounded"
                    : "p-1 mx-1 bg-blue-200 cursor-pointer rounded"
                }
                onClick={() => {
                  blogByCategory(category.name);
                }}
              >
                {category.name}
              </p>
            ))}
          </div>
        </div>
        {blogFeed
          .sort((a, b) => {
            // Assuming 'createdAt' is a Date object. If it's a string, convert it to Date as:
            // new Date(b.createdAt) - new Date(a.createdAt)
            return new Date(b.createdAt) - new Date(a.createdAt);
          })
          .map((blog) => (
            <div className="w-[500px] p-[20px] rounded-sm border mx-auto mt-4">
              {blog.thumbnail && (
                <div className="flex justify-center items-center my-1">
                  <img
                    src={blog.thumbnail}
                    alt="thumbnail"
                    className="w-[full] h-[300px]  "
                  />
                </div>
              )}

              <div className="">
                <p className="text-sm text-left">By : {blog.author}</p>
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl text-left font-semibold">
                    {blog.title}
                  </h1>
                  <p
                    className="p-1 cursor-pointer bg-blue-200 rounded"
                    onClick={() => blogByCategory(blog.category)}
                  >
                    {blog.category}
                  </p>
                </div>
                <p className="text-justify">
                  {blog.description.length > 150
                    ? blog.description.substring(0, 150) + "...."
                    : blog.description}
                </p>
                <div className="flex justify-end" >
                  <Link
                    className="text-right text-blue-500"
                    href={{
                      pathname: "/blogs/blog",
                      query: { slug: blog.slug },
                    }}
                  >
                    See more ...
                  </Link>
                </div>

                <hr className="mt-4"></hr>
                <div className="flex justify-between items-center">
                  <p
                    onClick={() => likeBlogId(blog._id)}
                    className="cursor-pointer"
                  >
                    Like {blog.likeCount}
                  </p>
                  <p>Comment {blog.commentCount}</p>
                </div>

                <div
                  onClick={() => setComment(blog._id)}
                  className="p-1 bg-blue-100 rounded-3xl mt-4  cursor-pointer"
                >
                  <p>Open Comment</p>
                </div>
              </div>
              {openComment && blogId == blog._id && (
                <div className="p-2 bg-blue-100 w-[450px]  mt-5 ">
                  <div className="flex justify-between items-center">
                    <h1 className="m-1">Comment Box </h1>
                    <p
                      className="text-right cursor-pointer"
                      onClick={() => unsetComment()}
                    >
                      X
                    </p>
                  </div>
                  <hr></hr>
                  <div className="text-left">
                    {isCommentLoading && <p>Loading...</p>}
                    {!isCommentLoading &&
                      commentData.length > 0 &&
                      commentData.map((comment) => (
                        <div className="p-1 bg-blue-100 rounded-3xl mt-2">
                          <div className="flex items-center gap-2">
                            <img
                              src={
                                comment.profilePicture ||
                                "https://thumbs.dreamstime.com/b/generic-person-gray-photo-placeholder-man-silhouette-white-background-144511705.jpg"
                              }
                              className="w-[30px] h-[30px] rounded-full"
                            ></img>
                            <p className="text-sm text-gray-400">
                              {comment.name}
                            </p>
                          </div>
                          <p className="ml-[40px]">{comment.comment}</p>
                        </div>
                      ))}
                  </div>

                  <form
                    onSubmit={submitComment}
                    className="flex items-center gap-3"
                  >
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="description"
                    ></label>
                    <textarea
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="description"
                      placeholder="Enter description"
                      rows="2"
                      required
                      onChange={(e) => setCommentText(e.target.value)}
                      value={commentText}
                      name="description"
                    ></textarea>
                    <button
                      type="submit"
                      className="p-1 bg-blue-400 rounded-sm text-white"
                    >
                      Comment
                    </button>
                  </form>
                </div>
              )}
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
