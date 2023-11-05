import React, { useState, useEffect, useRef } from "react";
import { MdDownloadForOffline } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { client, urlFor } from "../client";
import MasonryLayout from "./MasonryLayout";
import {
  loadMoreQuerySameCat,
  pinDetailMorePinQuery,
  pinDetailQuery,
} from "../utils/data";
import Spinner from "./Spinner";
import { Blurhash } from "react-blurhash";

const PinDetail = ({ user, scrollRef }) => {
  const [pins, setPins] = useState(null); // more similar pins
  const [pinDetails, setPinDetails] = useState(null);
  const [comment, setComment] = useState("");
  const [addingComment, setAddingComment] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [imageLoad, setImageLoad] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pb, setPb] = useState("");
  const { pinId } = useParams();
  const addComment = () => {
    if (comment) {
      setAddingComment(true);
      client
        .patch(pinId)
        .setIfMissing({ comments: [] })
        .insert("after", "comments[-1]", [
          {
            comment,
            _key: uuidv4(),
            postedBy: {
              _type: "postedBy",
              _ref: user._id,
            },
          },
        ])
        .commit()
        .then((res) => {
          // do res trả về: image ở dạng ref, data không đầy đủ nên phải fetch lại dữ liệu của pin từ sanity database
          fetchPinDetails(res);
          setComment("");
          setAddingComment(false);
        });
    }
  };

  // lấy tất cả dữ liệu của pin theo pin id
  const fetchPinDetails = () => {
    let query = pinDetailQuery(pinId);
    if (query) {
      client
        .fetch(query) //lấy dữ liệu từ database của sanity theo query

        .then((data) => {
          setPinDetails(data[0]);
          scrollRef?.current.scrollTo(0, 0);
          if (data[0]) {
            query = pinDetailMorePinQuery(data[0]);
            client.fetch(query).then((response) => {
              setPins(response);
              setLoading(false);
            });
          }
        });
    }
  };

  const imgDimensions = pinDetails?.image?.asset?.metadata?.dimensions;
  const blurHash = pinDetails?.image?.asset?.metadata?.blurHash;

  const paddingBottomMd = `md:pb-[${(
    100 /
    3 /
    imgDimensions?.aspectRatio
  ).toFixed(2)}%]`;

  const fetchCatData = async () => {
    const result = await client.fetch(
      loadMoreQuerySameCat(pins?.length, pinDetails?.category, pinId)
    );
    setPins(result);

    if (result.length === pins?.length) {
      setHasMore(false);
    }
  };

  const handleImageLoad = (e) => {
    e.target.classList.remove("opacity-0");
    e?.target?.nextElementSibling?.classList.add("opacity-0");
    setImageLoad(true);
  };

  useEffect(() => {
    fetchPinDetails();
  }, [pinId]);
  useEffect(() => {
    if (imgDimensions) {
      const paddingBottomVal = 100 / imgDimensions?.aspectRatio + "%";
      setPb(paddingBottomVal);
    }
  }, [imgDimensions, pinId]);

  if (!pinDetails) return <Spinner message="Loading pin ..." />;

  return (
    <div className="max-w-[1500px]  mx-auto">
      <div className="pin-details flex  flex-col justify-center lg:flex-row bg-white rounded-xl">
        <div className="max-w-[480px] md:max-w-[unset] w-full lg:w-1/3 mx-auto md:p-6">
          <div
            className={`flex justify-center items-center md:items-start h-0 w-full relative`}
            style={{ paddingBottom: `${pb}` }}
          >
            <img
              src={pinDetails?.image && urlFor(pinDetails.image).url()}
              alt="user-post"
              className="rounded-xl w-full opacity-0 transition-opacity duration-500 ease-in-out absolute inset-0"
              onLoad={(e) => {
                handleImageLoad(e);
              }}
            />
            <Blurhash
              hash={blurHash}
              resolutionX={32}
              resolutionY={32}
              punch={1}
              style={{
                width: "100%",
                height: "100%",
                paddingBottom: `${pb}`,
                borderRadius: "0.5rem",
              }}
              className="blurhash transition-opacity duration-500 ease-in-out top-0 left-0"
            />
          </div>
        </div>

        <div className="w-full p-5 lg:w-2/3 xl:min-w-620">
          <div className="flex items-center justify-start">
            <div className="flex gap-2 items-center ">
              <a
                href={`${pinDetails?.image?.asset?.url}?dl=`}
                download
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="bg-white w-9 h-9 r
                ounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none transition-opacity duration-300 ease"
              >
                <MdDownloadForOffline />
              </a>
            </div>
            <a
              href={pinDetails.destination}
              target="_blank"
              rel="noreferrer"
              className="truncate"
            >
              {pinDetails.destination}
            </a>
          </div>
          <div>
            <h1 className="text-2xl lg:text-4xl font-bold break-words mt-3">
              {pinDetails.title}
            </h1>
            <p className="mt-3">{pinDetails.about}</p>
          </div>
          <Link
            to={`/user-profile/${pinDetails?.postedBy?._id}`}
            className="flex gap-2 mt-5 items-center bg-white rounded-lg"
          >
            <img
              src={pinDetails?.postedBy?.image}
              className="w-6 h-6 lg:w-8 lg:h-8 rounded-full object-cover"
              alt="user-profile"
            />
            <p className="font-semibold capitalize">
              {pinDetails?.postedBy?.userName}
            </p>
          </Link>
          <h2 className="mt-5 text-lg font-bold lg:text-xl">Comments</h2>
          {/* Comment content section */}
          <div className="max-h-370 overflow-y-auto">
            {pinDetails?.comments?.map((comment, i) => (
              <div
                className="flex gap-2 mt-5 items-center bg-white rounded-lg"
                key={i}
              >
                <img
                  src={comment.postedBy?.image}
                  alt="user-profile"
                  className="w-10 h-10 rounded-full cursor-pointer"
                />
                <div className="flex flex-col">
                  <p className="font-bold">{comment.postedBy.userName}</p>
                  <p>{comment.comment}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Create comment button */}
          <div className="flex flex-wrap mt-6 gap-3 items-center">
            <Link to={`user-profile/${pinDetails?.postedBy?._id}`}>
              <img
                src={pinDetails?.postedBy?.image}
                className="w-10 h-10 rounded-full cursor-pointer"
                alt="user-profile"
              />
            </Link>
            <input
              className="flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300"
              type="text"
              placeholder="Add a comment"
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
              }}
            />
            <button
              type="button"
              className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
              onClick={addComment}
            >
              {addingComment ? "Posting the comment..." : "Post"}
            </button>
          </div>
        </div>
      </div>
      <h2 className="text-center font-bold text-xl lg:text-2xl mt-9 mb-6 lgmt-12 lg:mb-8">
        More like this
      </h2>
      {loading ? (
        <Spinner additionalClass="mt-8" message="Loading more pins..." />
      ) : pins?.length ? (
        <MasonryLayout
          pins={pins}
          setPins={setPins}
          hasMore={hasMore}
          fetchData={() => {
            fetchCatData();
          }}
        />
      ) : (
        <div className="flex justify-center font-bold items-center w-full text-xl mt-2">
          No pins found
        </div>
      )}
    </div>
  );
};

export default PinDetail;
