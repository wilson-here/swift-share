import React, { useState, useEffect } from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

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
  const [pinsCreated, setPinsCreated] = useState(null);
  const [pinsSaved, setPinsSaved] = useState(null);
  const [hasMoreCreated, setHasMoreCreated] = useState(true);
  const [hasMoreSaved, setHasMoreSaved] = useState(true);
  const [text, setText] = useState("Created"); //Created || Saved
  const [activeBtn, setActiveBtn] = useState("created");
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
    setLoading(true);
    const createdPinsQuery = userCreatedPinsQuery(userId);
    client.fetch(createdPinsQuery).then((data) => {
      setPinsCreated(data);
    });
    const savedPinsQuery = userSavedPinsQuery(userId);
    client.fetch(savedPinsQuery).then((data) => {
      setPinsSaved(data);
    });
    setLoading(false);
  }, []);

  if (!user) {
    return <Spinner message="Loading profile..." />;
  }
  const fetchUserCreatedPinData = async () => {
    const result = await client.fetch(
      loadMoreQuerySameUserCreated(pinsCreated?.length, userId)
    );
    setPinsCreated(result);
    if (pinsCreated?.length === result.length) {
      setHasMoreCreated(false);
    }
  };

  const fetchUserSavedPinData = async () => {
    const result = await client.fetch(
      loadMoreQuerySameUserSaved(pinsSaved?.length, userId)
    );
    setPinsSaved(result);
    if (pinsSaved?.length === result.length) {
      setHasMoreSaved(false);
    }
  };

  const handleImageLoad = (e) => {
    e.target.classList.remove("opacity-0");
    e?.target?.previousElementSibling?.classList.add("hidden");
  };

  return (
    <div className="relative pb-2 h-full justify-center items-center">
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col">
          <div className="flex flex-col justify-center items-center">
            <div className="relative leading-none w-full text-[0px]">
              <Skeleton
                width="100%"
                className="skeleton transition-opacity duration-500 ease-in-out absolute top-0 left-0 leading-none h-[370px] 2xl:h-[510px] text-[0px]"
                containerClassName="leading-none text-[0px]"
                style={{ fontSize: 0 }}
              />
              <img
                src={randomImg}
                className="w-full h-370 2xl:h-510 shadow-lg object-cover opacity-0 transition-opacity duration-500 ease-in-out"
                alt="banner-pic"
                onLoad={(e) => {
                  handleImageLoad(e);
                }}
              />
            </div>
            <img
              className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover relative z-10"
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
              onClick={() => {
                setText("Created");
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
              onClick={() => {
                setText("Saved");
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

          {loading ? (
            <Spinner message="Loading pins..." />
          ) : pinsCreated && text === "Created" ? (
            <div className="px-2">
              <MasonryLayout
                pins={pinsCreated}
                setPins={setPinsCreated}
                hasMore={hasMoreCreated}
                fetchData={fetchUserCreatedPinData}
              />
            </div>
          ) : pinsSaved && text === "Saved" ? (
            <div className="px-2">
              <MasonryLayout
                pins={pinsSaved}
                setPins={setPinsSaved}
                hasMore={hasMoreSaved}
                fetchData={fetchUserSavedPinData}
              />
            </div>
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
