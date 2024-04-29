import React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
const profile = () => {
  const [token, setToken] = useState("");
  const [isDetails, setIsDetails] = useState(true);
  const [isDashboard, setIsDashboard] = useState(false);
  const [isEditProfile, setIsEditProfile] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [internetError, setInternetError] = useState("");
  const [isDashboardLoading, setIsDashboardLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [blogID, setBlogID] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    instagram: "",
    twitter: "",
    facebook: "",
    profilePicture: "",
  });
  useEffect(() => {
    if (!isLoading) {
      setFormData({
        name: profileData.profile.name,
        username: profileData.profile.username,
        instagram: profileData.profile.instagram,
        twitter: profileData.profile.twitter,
        facebook: profileData.profile.facebook,
        profilePicture: profileData.profile.profilePicture,
      });
    }
  }, [isLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = fetch(
      "https://buzzmash.onrender.com/api/v1/user/updateProfile",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          username: formData.username,
          instagram: formData.instagram,
          twitter: formData.twitter,
          facebook: formData.facebook,
          profile: formData.profilePicture,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          console.log("Profile Updated");
          window.location.reload();
        }
      });
  };

  const deleteBlog = async () => {
    if (blogID) {
      const response = fetch(
        `https://buzzmash.onrender.com/api/v1/blog/delete/${blogID}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            console.log("Blog Deleted");
            setShowAlert(false);
            handleDashboard();
          }
        });
    }
  };

  const handleDashboard = () => {
    setIsDashboardLoading(true);

    try {
      const response = fetch(
        "https://buzzmash.onrender.com/api/v1/blog/getUserBlogs",
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
          console.log(data);
          if (data.success) {
            // console.log(data.blogs);
            setDashboardData(data.blogs);
            // setIsDashboardLoading(false);
            if (dashboardData) {
              setIsDashboardLoading(false);
              console.log(dashboardData);
            }
            console.log(dashboardData);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const showDeleteAlert = (id = "") => {
    setBlogID(id);
    setShowAlert(!showAlert);
  };
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    } else {
      window.location.href = "/auth/login";
    }
  }, []);

  // This useEffect depends on the token
  // It will run after the token is set
  useEffect(() => {
    if (token) {
      const timer = setTimeout(() => {
        fetchProfile();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [token]); // Dependency array includes token

  const fetchProfile = async () => {
    const isInternetConnected = window.navigator.onLine;
    if (!isInternetConnected) {
      setInternetError("Please check your internet connection");
      return;
    } else {
      setInternetError("");
    }

    setIsLoading(true);
    console.log("fetching profile");
    const response = await fetch(
      "https://buzzmash.onrender.com/api/v1/user/profile",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();
    console.log(data);

    if (data.message === "Token is not valid") {
    } else {
      setProfileData(data);
      setIsLoading(false);
    }
  };

  const seletctDetails = () => {
    fetchProfile();
    console.log("details");
    setIsDetails(true);
    setIsDashboard(false);
    setIsEditProfile(false);
  };
  const seletctDashboard = () => {
    handleDashboard();
    console.log("dashboard");
    setIsDetails(false);
    setIsDashboard(true);
    setIsEditProfile(false);
  };
  const seletctEditProfile = () => {
    console.log("edit profile");
    setIsDetails(false);
    setIsDashboard(false);
    setIsEditProfile(true);
  };

  return (
    <div>
      <div className="w-full flex">
        <div className="w-[200px] bg-blue-200 h-[100vw]">
          <h1 className="text-center text-2xl">Profile</h1>
          <div className="text-left mt-[50px]  flex flex-col cursor-pointer text-lg gap-1 ">
            <p
              className="mx-auto p-2 bg-blue-300 hover:bg-blue-400 w-full"
              onClick={() => seletctDetails()}
            >
              Details
            </p>
            <p
              className="mx-auto p-2 bg-blue-300 hover:bg-blue-400 w-full"
              onClick={() => seletctDashboard()}
            >
              Dashboard
            </p>
            <p
              className="mx-auto p-2 bg-blue-300  hover:bg-blue-400  w-full"
              onClick={() => seletctEditProfile()}
            >
              Edit Profile
            </p>
          </div>
        </div>
        <div className="w-full h-[100vw]">
          {internetError && <p>{internetError}</p>}
          {isDetails && (
            <>
              <div>
                <h1 className="text-center text-4xl">Profile Details</h1>
                <div>
                  {isLoading && <p></p>}
                  {!isLoading && (
                    <>
                      <div className=" w-[400px] mx-auto p-5  bg-blue-100 rounded ">
                        <div className="flex items-center gap-4">
                          <img
                            src={
                              profileData.profile.profilePicture ||
                              "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg"
                            }
                            className="w-[75px] h-[75px] object-cover rounded-[50%]"
                          ></img>
                          <div className="flex flex-col ">
                            <p>{profileData.profile.name}</p>
                            <p>{profileData.profile.username}</p>
                          </div>
                        </div>
                        <p>{profileData.profile.email}</p>
                        <h1 className="text-lg">Social Links</h1>
                        <div className="flex gap-1">
                          <Link href={profileData.profile.facebook}>
                            <Image
                              src={"/fb.png"}
                              width={20}
                              height={20}
                              alt="facebook"
                            ></Image>
                          </Link>

                          <Link href={profileData.profile.instagram}>
                            <Image
                              src={"/insta.webp"}
                              width={20}
                              height={20}
                              alt="instagram"
                            ></Image>
                          </Link>

                          <Link href={profileData.profile.twitter}>
                            <Image
                              src={"/x.png"}
                              width={20}
                              alt="twitter"
                              height={20}
                            ></Image>
                          </Link>
                        </div>
                      </div>
                    </>
                  )}

                  {/* <p>{profileData.profile.name}</p>
                  <p>{profileData.email}</p>
                  <p>{profileData.username}</p> */}
                </div>
              </div>
            </>
          )}
          {isDashboard && (
            <div>
              <h1 className="text-4xl text-center"> My Dashboard</h1>
              {showAlert && (
                <div className="p-5 bg-blue-500 text-center absolute left-[600px] ease-in-out transition-all duration-75 top-[300px] w-[400px]">
                  <p className="mx-auto text-white">
                    Do you want to Delete this blog
                  </p>

                  <div className="flex justify-around items-center mt-5 ">
                    <p
                      className="bg-green-500 p-1 text-white cursor-pointer rounded"
                      onClick={() => setShowAlert(false)}
                    >
                      NO
                    </p>
                    <p
                      className="bg-red-500 p-1 cursor-pointer rounded text-white"
                      onClick={() => deleteBlog()}
                    >
                      YES
                    </p>
                  </div>
                </div>
              )}

              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
                {isDashboardLoading && <p>Loading...</p>}
                {/* {dashboardData.} */}

                {!isDashboardLoading &&
                  dashboardData
                    .sort(
                      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                    )
                    .map((blog) => {
                      return (
                        <div
                          key={blog.id}
                          className="bg-blue-100 p-2 rounded-md shadow-lg"
                        >
                          {" "}
                          {/* Ensure you have a unique key */}
                          <span className="text-sm text-left">
                            By : {blog.author}
                          </span>
                          <div className="flex justify-between items-center">
                            <h1 className="text-2xl">{blog.title}</h1>
                            <span className="p-1 bg-blue-200 rounded">
                              {blog.category}
                            </span>
                          </div>
                          <p className="text-sm text-left">
                            {blog.description.length > 150
                              ? blog.description.substring(0, 150) + "...."
                              : blog.description}
                          </p>
                          <div className="flex justify-between items-center">
                            <div>
                              <p>Likes {blog.likeCount}</p>
                              <p>Comments {blog.commentCount}</p>
                            </div>
                            <div>
                              <p
                                className="text-white bg-red-500 p-1 cursor-pointer rounded-lg"
                                onClick={() => showDeleteAlert(blog._id)}
                              >
                                Delete
                              </p>
                              <p className="text-white bg-green-500 p-1 rounded-lg mt-1">
                                Edit
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
              </div>
            </div>
          )}
          {isEditProfile && (
            <>
              <div class="max-w-lg mx-auto p-5">
                <form class="space-y-6 " onSubmit={handleSubmit}>
                  <div>
                    <label
                      for="name"
                      class="block text-sm font-medium text-gray-700"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label
                      for="username"
                      class="block text-sm font-medium text-gray-700"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label
                      for="profilePicture"
                      class="block text-sm font-medium text-gray-700"
                    >
                      Profile Picture Link
                    </label>
                    <input
                      type="text"
                      id="profilePicture"
                      name="profilePicture"
                      onChange={handleChange}
                      value={formData.profilePicture}
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label
                      for="instagram"
                      class="block text-sm font-medium text-gray-700"
                    >
                      Instagram
                    </label>
                    <input
                      type="text"
                      id="instagram"
                      name="instagram"
                      onChange={handleChange}
                      value={formData.instagram}
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label
                      for="twitter"
                      class="block text-sm font-medium text-gray-700"
                    >
                      Twitter
                    </label>
                    <input
                      type="text"
                      id="twitter"
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleChange}
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label
                      for="facebook"
                      class="block text-sm font-medium text-gray-700"
                    >
                      Facebook
                    </label>
                    <input
                      type="text"
                      id="facebook"
                      value={formData.facebook}
                      name="facebook"
                      onChange={handleChange}
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <button
                    type="submit"
                    class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default profile;
