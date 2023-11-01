import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { MdDownloadForOffline } from "react-icons/md";
import { AiTwotoneDelete } from "react-icons/ai";
import { BsFillArrowUpRightCircleFill, BsImage } from "react-icons/bs";

import { client, urlFor } from "../client";
import { fetchUser } from "../utils/fetchUser";
import Skeleton from "react-loading-skeleton";
import { decode } from "blurhash";

const Pin = ({ pin }) => {
  const { postedBy, image, _id, destination, save } = pin; // thông tin về author of pin, image of pin, id of pin, link link of pin, những người save pin
  const imgDimensions = pin?.image?.asset?.metadata?.dimensions;
  // const blurHash = pin?.image?.asset?.metadata?.blurHash;
  // const pixels = decode(blurHash, 100, 100);

  const [postHovered, setPostHovered] = useState(false);
  const [savingPost, setSavingPost] = useState(false);
  const [imageLoad, setImageLoad] = useState(false);

  // const canvas = document.createElement("canvas");
  // const ctx = canvas.getContext("2d");
  // const imageData = ctx.createImageData(100, 100);
  // imageData.data.set(pixels);
  // ctx.putImageData(imageData, 0, 0);
  // const dataUrl = canvas.toDataURL();

  const navigate = useNavigate();
  const user = fetchUser();
  const alreadySaved = !!save?.filter(
    (item) => item.postedBy?._id === user?.sub
  )?.length;

  const savePin = (id) => {
    if (!alreadySaved) {
      setSavingPost(true);
      // thêm object instance của schema save c(thông tin của 1 người dùng lưu pin) vào mảng save của pin
      client
        .patch(id) // id của doc pin hiện tại
        .setIfMissing({ save: [] })
        .insert("after", "save[-1]", [
          {
            _key: uuidv4(),
            // lấy thong tin của user save post: tìm trong các doc của user schema, doc có id là id của người dùng hiện tại đang đăng nhập (user.sub)
            postedBy: {
              _type: "postedBy",
              _ref: user?.sub,
            },
            userId: user?.sub,
          },
        ])
        .commit()
        .then(() => {
          window.location.reload();
          setSavingPost(false);
        });
    }
  };
  const deletePin = (id) => {
    client.deletePin(id).then(() => {
      window.location.reload();
    });
  };

  const handleImageLoad = (e) => {
    e.target.classList.remove("hidden");
    setImageLoad(true);
  };

  return (
    <div className="mx-2 my-4 ">
      <div
        onMouseEnter={() => {
          setPostHovered(true);
        }}
        onMouseLeave={() => {
          setPostHovered(false);
        }}
        onClick={() => navigate(`/pin-detail/${_id}`)}
        className="relative cursor-zoom-in w-auto rounded-lg overflow-hidden transition-all duration-500 ease-in-out hover:shadow-lg"
        id="canvas"
      >
        <img
          className="rounded-lg w-full hidden"
          alt="user-post"
          src={image.asset.url}
          onLoad={(e) => {
            handleImageLoad(e);
          }}
        />
        {imageLoad ? null : (
          <Skeleton
            height={0}
            style={{
              paddingBottom: `${(1 / imgDimensions?.aspectRatio) * 100}%`,
              backgroundImage: "url()",
            }}
            className="rounded-lg"
          />
        )}
        {/* <div
          height={0}
          style={{
            paddingBottom: `${(1 / imgDimensions?.aspectRatio) * 100}%`,
            backgroundImage: `url(${dataUrl})`,
            // backgroundRepeat: "no-repeat",
            // backgroundSize: "cover",
          }}
          className="rounded-lg w-full"
        ></div> */}

        {postHovered && (
          <div
            className="absolute top-0 w-full h-full flex flex-col justify-between p-2 z-50"
            style={{ height: "100%" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <a
                  href={`${image?.asset?.url}?dl=`}
                  download
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none transition-opacity duration-300 ease"
                >
                  <MdDownloadForOffline />
                </a>
              </div>
              {alreadySaved ? (
                <button
                  type="button"
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                >
                  {save?.length} Saved
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    savePin(_id);
                  }}
                  type="button"
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                >
                  {savingPost ? "Saving" : "Save"}
                </button>
              )}
            </div>
            <div className="flex justify-between items-center gap-2 w-full">
              {destination && (
                <a
                  href={destination}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white flex gap-2 items-center text-black font-bold px-2 py-1 rounded-full opacity-75 hover:opacity-100 hover:shadow-md overflow-hidden"
                >
                  <BsFillArrowUpRightCircleFill className="flex-shrink-0" />

                  <span className="truncate">{destination}</span>
                </a>
              )}

              {postedBy?._id === user?.sub && ( // if the user is the pin author then allow deletion
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePin(_id);
                  }}
                  className="bg-white p-2 opacity-70 hover:opacity-100 text-dark font-bold text-base rounded-3xl hover:shadow-md outline-none flex-shrink-0"
                >
                  <AiTwotoneDelete />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* user profile starts */}
      <Link
        to={`user-profile/${postedBy?._id}`}
        className="flex gap-1 mt-1 items-center"
      >
        {(
          <img
            src={postedBy?.image}
            className="w-8 h-8 rounded-full object-cover"
            alt="user-profile"
          />
        ) || <Skeleton className="w-8 h-8 rounded-full object-cover" />}
        {(
          <p className="font-semibold capitalize text-xs sm:text-base">
            {postedBy?.userName}
          </p>
        ) || (
          <Skeleton
            containerClassName="grow"
            className="font-semibold capitalize text-xs sm:text-base"
            count={1}
          />
        )}
      </Link>
      {/* user profile ends */}
    </div>
  );
};

export default Pin;
