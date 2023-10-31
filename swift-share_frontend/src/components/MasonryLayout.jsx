import React from "react";
import Masonry from "react-masonry-css";
import Pin from "./Pin";
import Skeleton from "react-loading-skeleton";

const breakpointObj = {
  default: 4,
  3000: 6,
  2000: 5,
  1200: 3,
  1000: 2,
  500: 1,
};

const MasonryLayout = ({ pins, additionalClass }) => {
  return (
    <Masonry
      className={`flex animate-slide-fwd ${additionalClass}`}
      breakpointCols={breakpointObj}
    >
      {pins?.map((pin) => {
        const dimensions = pin?.image?.asset?.metadata?.dimensions;
        return (
          (
            // sua thanh pin skeleton element, add condition rendering
            <Skeleton
              height={0}
              style={{
                paddingBottom: `${(1 / dimensions?.aspectRatio) * 100}%`,
              }}
            />
          ) || <Pin key={pin._id} pin={pin} className="w-max" />
        );
      })}
    </Masonry>
  );
};

export default MasonryLayout;
