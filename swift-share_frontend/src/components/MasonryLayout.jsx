import React, { useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import Pin from "./Pin";

const breakpointObj = {
  default: 4,
  3000: 6,
  2000: 5,
  1200: 4,
  1000: 3,
  500: 2,
  375: 1,
};

const MasonryLayout = ({ pins, additionalClass }) => {
  return (
    <Masonry
      className={`flex animate-slide-fwd ${additionalClass}`}
      breakpointCols={breakpointObj}
    >
      {pins?.map((pin) => {
        return <Pin key={pin._id} pin={pin} className="w-max" />;
      })}
    </Masonry>
  );
};

export default MasonryLayout;
