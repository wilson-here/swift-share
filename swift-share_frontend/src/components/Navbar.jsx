import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMdAdd, IoMdSearch } from "react-icons/io";
import Skeleton from "react-loading-skeleton";

const Navbar = ({ searchTerm, setSearchTerm, user }) => {
  const navigate = useNavigate();
  if (!user) return null;

  return (
    <div className="flex gap-2 md:gap-5 w-full mt-5 pb-7">
      <div className="flex justify-start items-center w-full px-2 rounded-md bg-white border-none outline-none focus-within:shadow-sm">
        <IoMdSearch fontSize={21} className="ml-1" />
        <input
          type="text"
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          placeholder="Search"
          value={searchTerm}
          onFocus={() => navigate("/search")}
          className="p-2 w-full bg-white outline-none"
        />
      </div>
      <div className="flex gap-3 shrink-0">
        <Link
          to={`user-profile/${user?._id}`}
          className="hidden md:block flex-shrink-0 w-12 h-12 rounded-full"
        >
          {user.image ? (
            <img
              src={user.image}
              alt={`${user.userName}'s avatar`}
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
        <Link
          to="create-pin"
          className="text-white rounded-lg w-12 h-12 md:w-12 md:h-12 flex justify-center items-center flex-shrink-0"
          style={{ background: "#FFB900" }}
        >
          <IoMdAdd />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
