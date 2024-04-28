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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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
    setProfileData(data);
    if (data) {
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
          {isDashboard && <div>Dashboard</div>}
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
