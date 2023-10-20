import React, { useState, useEffect } from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";

import {
  userCreatedPinsQuery,
  userQuery,
  userSavedPinsQuery,
} from "../utils/data";

import { client } from "../client";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";
import { fetchUser } from "../utils/fetchUser";

const randomImg =
  "https://source.unsplash.com/1600x900/?nature,photography,technology";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [pin, setPin] = useState(null);
  const [text, setText] = useState("Created"); //Created || Saved
  const [activeBtn, setActiveBtn] = useState("created");

  const navigate = useNavigate();
  const { userId } = useParams();

  const userInfo = fetchUser();

  useEffect(() => {
    const query = userQuery(userId);
    client.fetch(query).then((data) => {
      setUser(data[0]);
    });
  }, [userId]);

  if (!user) {
    return <Spinner message="Loading profile..." />;
  }

  return (
    <div className="relative pb-2 h-full justify-center items-center">
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col mb-7">
          <div className="flex flex-col justify-center items-center">
            <img
              src={randomImg}
              className="w-full h-370 2xl:h-510 shadow-lg object-cover"
              alt="banner-pic"
            />
            <img
              className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover"
              src={user.image}
              alt="user-pic"
            />
            <h1 className="font-bold text-3xl text-center mt-3">
              {user.userName}
            </h1>
            <div className="absolute top-0 z-1 right-0 p-2">
              {/* {userId === userInfo?.sub && } */}

              {googleLogout()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
