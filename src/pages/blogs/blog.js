import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const Blog = () => {
  const router = useRouter();
  const [blogId, setBlogId] = useState("");
  const [slug, setSlug] = useState("");
  const [blog, setBlog] = useState({});
  const [token, setToken] = useState("");
  const [commentData, setCommentData] = useState([]);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token);
    if (!token) {
      router.push("/auth/login");
    }
  }, []);

  useEffect(() => {
fetchComment();
  }, [blogId])
  const fetchComment = () => {
    try {
     
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
            commentData.commentCount += 1;
          }
         

         
        })
        .catch((err) => {
          console.log(err.message);
        });
    } catch (err) {
      console.error(err);
    
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
  useEffect(() => {
    // Ensure the slug is available
    if (!router.isReady) return;

    const { slug } = router.query;
    setSlug(slug);
    if (slug && token) {
      console.log(slug); // Just to verify it's being read correctly
      const response = fetch(
        `https://buzzmash.onrender.com/api/v1/blog/get/${slug}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            console.log(data.blog);
            setBlog(data.blog);
            setBlogId(data.blog._id);

            setBlogId(data.blog._id);
          } else {
            console.error("Error fetching data:", data.message);
          }
        });
    } else {
      console.error("Slug not found");
    }
  }, [router.isReady, router.query.slug, token]);
  return (
    <div>
      <div className="w-1/2 mx-auto p-5 bg-blue-50">
        <div className="flex items-center justify-between ">
          <p>By : {blog.author}</p>
          <h1 className="text-4xl text-center ">{blog.title}</h1>

          <p className="p-[4px] text-sm bg-blue-300 rounded-sm">
            {blog.category}
          </p>
        </div>
        <img
          src={blog.thumbnail}
          className="w-[500px] h-[500px] my-4 object-fill mx-auto"
        ></img>
        <p>{blog.description}</p>
        <hr className="h-[2px] bg-blue-100"></hr>
        <div className="w-full bg-blue-200 p-2">
          <p>Likes {blog.likeCount}</p>
          <p>Comments {blog.commentCount}</p>

          <div className="w-full bg-blue-100">
            <p className="text-center text-xl">All Comments</p>

            {commentData.map((comment) => (
              <div className="p-1 bg-blue-100 rounded-3xl mt-2">
                <div className="flex items-center gap-2">
                  <img
                    src={
                      comment.profilePicture ||
                      "https://thumbs.dreamstime.com/b/generic-person-gray-photo-placeholder-man-silhouette-white-background-144511705.jpg"
                    }
                    className="w-[30px] h-[30px] rounded-full"
                  ></img>
                  <p className="text-sm text-gray-400">{comment.name}</p>
                </div>
                <p className="ml-[40px]">{comment.comment}</p>
              </div>
            ))}
            <div className="">
              <form
                onSubmit={submitComment}
                className=" flex items-center gap-2 w-full bg-blue-100 p-2 rounded-3xl mt-2"
              >
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="description"
                ></label>
                <textarea
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="description"
                  placeholder="Enter description"
                 
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
