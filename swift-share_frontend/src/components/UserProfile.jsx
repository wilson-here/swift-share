import React, { useState, useEffect } from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom";

import {
  loadMoreQuerySameUserCreated,
  loadMoreQuerySameUserSaved,
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

const activeBtnStyles =
  "bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none";
const notActiveBtnStyles =
  "bg-primary-500 text-black font-bold p-2 rounded-full w-20 outline-none";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [pins, setPins] = useState(null);
  const [text, setText] = useState("Created"); //Created || Saved
  const [activeBtn, setActiveBtn] = useState("created");
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(null);

  const navigate = useNavigate();
  const { userId } = useParams();

  const userInfo = fetchUser();

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  useEffect(() => {
    const query = userQuery(userId);
    client.fetch(query).then((data) => {
      setUser(data[0]);
    });
  }, [userId]);

  useEffect(() => {
    if (text === "Created") {
      setLoading(true);

      const createdPinsQuery = userCreatedPinsQuery(userId);
      client.fetch(createdPinsQuery).then((data) => {
        setPins(data);
        setLoading(false);
      });
    } else {
      setLoading(true);

      const savedPinsQuery = userSavedPinsQuery(userId);
      client.fetch(savedPinsQuery).then((data) => {
        setPins(data);
        setLoading(false);
      });
    }
  }, [text, userId]);

  if (!user) {
    return <Spinner message="Loading profile..." />;
  }
  const fetchUserCreatedPinData = async () => {
    const result = await client.fetch(
      loadMoreQuerySameUserCreated(pins?.length, userId)
    );
    setPins(result);
    if (result.length === pins?.length) {
      setHasMore(false);
    }
  };

  const fetchUserSavedPinData = async () => {
    const result = await client.fetch(
      loadMoreQuerySameUserSaved(pins?.length, userId)
    );
    setPins(result);
    if (result.length === pins?.length) {
      setHasMore(false);
    }
  };

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
              {userId === userInfo?.sub && (
                <button
                  onClick={handleLogout}
                  type="button"
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
          <div className="text-center my-7">
            <button
              type="button"
              onClick={(e) => {
                setText(e.target.textContent);
                setActiveBtn("created");
              }}
              style={{ minWidth: "100px" }}
              className={`${
                activeBtn === "created" ? activeBtnStyles : notActiveBtnStyles
              }`}
            >
              Created
            </button>
            <button
              type="button"
              onClick={(e) => {
                setText(e.target.textContent);
                setActiveBtn("saved");
              }}
              style={{ minWidth: "100px" }}
              className={`${
                activeBtn === "saved" ? activeBtnStyles : notActiveBtnStyles
              }`}
            >
              Saved
            </button>
          </div>
          {pins?.length ? (
            <div className="px-2">
              <MasonryLayout
                pins={pins}
                setPins={setPins}
                hasMore={hasMore}
                fetchData={
                  activeBtn === "created"
                    ? fetchUserCreatedPinData
                    : fetchUserSavedPinData
                }
              />
            </div>
          ) : loading ? (
            <Spinner message="Loading pins..." />
          ) : (
            <div className="flex justify-center font-bold items-center w-full text-xl mt-2">
              No pins found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
