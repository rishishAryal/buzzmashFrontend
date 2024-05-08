import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
const update = () => {
  const router = useRouter();
  const [blogId, setBlogId] = useState("");
  const [slug, setSlug] = useState("");
  const [blog, setBlog] = useState({});
  const [token, setToken] = useState("");
  
  const [file, setFile] = useState(null);

  const [formData, setFormData] = useState({
    author: "",
    title: "",
    description: "",
    category: "",
    thumbnail: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token);
    if (!token) {
      router.push("/auth/login");
    }
  }, []);

  // const blogSlug = r;

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
            if (data.blog) {
              setFormData({
                author: data.blog.author,
                title: data.blog.title,
                description: data.blog.description,
                category: data.blog.category,
                thumbnail: data.blog.thumbnail,
              });
            }

            setBlogId(data.blog._id);
          } else {
            console.error("Error fetching data:", data.message);
          }
        });
    } else {
      console.error("Slug not found");
    }
  }, [router.isReady, router.query.slug, token]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form submitted", formData, blogId);
    const response = fetch(
      `https://buzzmash.onrender.com/api/v1/blog/update/${blogId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log(data);
          // setFormData({
          //   author: data.blog.author,
          //   title: data.blog.title,
          //   description: data.blog.description,
          //   category: data.blog.category,
          //   thumbnail: data.blog.thumbnail,
          // });
        }
      });

    //https://buzzmash.onrender.com/api/v1/blog/update
  };


  const handleFileChnage = (e) => {
    if (e.target.files[0]) {
      // Ensure there's at least one file
      setFile(e.target.files[0]);
    }
  };



  const handleThumbnail = async (e) => {
    try {
      e.preventDefault();
      const formData = new FormData();
      formData.append("thumbnail", file);
      // formData.append("blogId", blogId);

      const response = await fetch(
          `https://buzzmash.onrender.com/api/v1/blog/addBlogThumbnail/${blogId}`,
          {
              method: "POST",
              headers: {
                  Authorization: `Bearer ${token}`
              },
              body: formData,
          }
      )
      const data = await response.json();
      if (data.success) {
          console.log('Thumbnail uploaded:', data);
          setFormData((prevState) => ({
            ...prevState,
            thumbnail: data.thumbnail,
          }));
      }ss

    
  } catch (error) {
      console.error('Error updating blog thumbnail:', error);
  }
  }



  return (
    <div>
      <div className="w-1/2 mx-auto">
        <h1 className="text-2xl font-bold text-center">Update Blog</h1>

        <img 
        className="w-[400px] h-[400px] mx-auto"
        src={formData.thumbnail}
        ></img>
        <form className="text-center">
          <input
          onChange={handleFileChnage}
          type="file"
          ></input>
          {file && (
            <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={handleThumbnail}
            >Upload</button>
          
          )}
         
        </form>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="author"
              className="block text-sm font-medium text-gray-700"
            >
              Author
            </label>
            <input
              id="author"
              name="author"
              type="text"
              value={formData.author}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              required
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></textarea>
          </div>
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <input
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              type="text"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="hidden">
            <label
              htmlFor="thumbnail"
              className="block text-sm font-medium text-gray-700"
            >
              Thumbnail Image
            </label>
            <input
              id="thumbnail"
              name="thumbnail"
              onChange={handleChange}
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <button
              type="submit"
              className="py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-md"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default update;
