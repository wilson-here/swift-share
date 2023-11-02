import React from "react";
import { ThreeCircles } from "react-loader-spinner";

const Spinner = ({ message, additionalClass }) => {
  return (
    <div
      className={`flex flex-col justify-center items-center w-full h-full ${additionalClass}`}
    >
      <ThreeCircles color="#FFB900" height={50} width={200} className="m-5" />
      <p className="text-sm font-medium lg:text-lg text-center px-2">
        {message}
      </p>
    </div>
  );
};

export default Spinner;
