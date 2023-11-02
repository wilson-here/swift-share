import React, { useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import Pin from "./Pin";
import { client } from "../client";
import { initialLoadQuery, loadMoreQuery } from "../utils/data";
import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from "./Spinner";

const breakpointObj = {
  default: 4,
  3000: 6,
  2000: 5,
  1200: 4,
  1000: 3,
  500: 2,
  375: 1,
};

const MasonryLayout = ({ pins, setPins, additionalClass }) => {
  const [hasMore, setHasMore] = useState(true);

  const fetchData = async () => {
    const result = await client.fetch(loadMoreQuery(pins?.length));
    if (result.length === pins?.length) {
      setHasMore(false);
    } else {
      setPins(result);
    }
  };

  const refresh = async () => {
    const result = await client.fetch(initialLoadQuery);
    setPins(result);
  };

  return (
    <div id="masonryWrapper">
      <InfiniteScroll
        dataLength={pins?.length}
        scrollableTarget="right"
        next={fetchData}
        hasMore={hasMore}
        scrollThreshold={0.9}
        loader={<Spinner additionalClass="mb-8" />}
        endMessage={
          <p className="text-gray-500 pt-4 py-8 font-bold italic text-center text-xs sm:text-base capitalize">
            - 👏👏👏 You're all caught up for now -
          </p>
        }
        refreshFunction={refresh}
        pullDownToRefresh
        pullDownToRefreshThreshold={50}
        pullDownToRefreshContent={
          <h3 style={{ textAlign: "center" }}>&#8595; Pull down to refresh</h3>
        }
        releaseToRefreshContent={
          <h3 style={{ textAlign: "center" }}>&#8593; Release to refresh</h3>
        }
      >
        <Masonry
          className={`flex animate-slide-fwd ${additionalClass}`}
          breakpointCols={breakpointObj}
        >
          {pins?.map((pin) => (
            <Pin key={pin._id} pin={pin} className="w-max" />
          ))}
        </Masonry>
      </InfiniteScroll>
    </div>
  );
};

export default MasonryLayout;
