import React, { useState, useRef, useEffect } from "react";
import { HiMenu } from "react-icons/hi";
import { AiFillCloseCircle } from "react-icons/ai";
import { Link, Route, Routes } from "react-router-dom";

import { Sidebar, UserProfile } from "../components";
import Pins from "./Pins";
import { userQuery } from "../utils/data";
import { client } from "../client";
import logo from "../assets/logo-yellow.svg";
import { fetchUser } from "../utils/fetchUser";
import Skeleton from "react-loading-skeleton";
const Home = () => {
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [user, setUser] = useState(null);
  const scrollRef = useRef(null);

  const userInfo = fetchUser();

  useEffect(() => {
    const query = userQuery(
      userInfo?.sub //id của người đang đăng nhập
    );
    client.fetch(query).then((data) => {
      setUser(data[0]);
    });
  }, []);
  useEffect(() => {
    // scrollRef.current.scrollTo(0, 0);
  }, []);
  return (
    <div className="flex bg-gray-50 md:flex-row flex-col h-screen transition-height duration-75 ease-out">
      {/* <<<Sidebar PC */}
      <div className="hidden md:flex h-screen flex-initial">
        <Sidebar user={user && user} />
      </div>
      {/* Sidebar PC>>> */}

      {/* <<<Navbar + Sidebar mobile */}
      <div className="flex md:hidden flex-row">
        <div className="p-2 w-full flex flex-row justify-between items-center shadow-md">
          <HiMenu
            fontSize={40}
            className="cursor-pointer"
            onClick={() => {
              setToggleSidebar(true);
            }}
          />
          <Link to="/" className="h-full flex items-center">
            <img src={logo} alt="logo" className="w-28" />
          </Link>
          <Link
            to={`user-profile/${user?._id}`}
            className="w-10 lg:w-16 rounded-full"
          >
            {user?.image ? (
              <img
                src={user?.image}
                alt="logo"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <Skeleton
                width="100%"
                className="text-[0px]"
                containerClassName="leading-none text-[0px]"
                style={{ fontSize: 0 }}
              />
            )}
          </Link>
        </div>
        {toggleSidebar && (
          <div className="fixed w-4/5 max-w-[300px] bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in">
            <div className="absolute right-0 flex justify-end items-center p-3">
              <AiFillCloseCircle
                fontSize="30px"
                className="cursor-pointer"
                onClick={() => {
                  setToggleSidebar(false);
                }}
              />
            </div>
            <Sidebar user={user && user} closeToggle={setToggleSidebar} />
          </div>
        )}
      </div>
      {/* Navbar + Sidebar mobile>>> */}

      {/* <<<Navbar + Main (Pins / UserProfile) */}
      <div
        className="pb-2 flex-1 h-screen overflow-y-scroll overflow-x-hidden"
        id="right"
        ref={scrollRef}
        style={{ scrollBehavior: "smooth" }}
      >
        <Routes>
          <Route
            path="/user-profile/:userId"
            element={<UserProfile toggleSidebar={toggleSidebar} />}
          />
          <Route
            path="/*"
            element={<Pins user={user && user} scrollRef={scrollRef} />}
          />
        </Routes>
      </div>
      {/* Navbar + Main (Pins / UserProfile)>>> */}
    </div>
  );
};

export default Home;
