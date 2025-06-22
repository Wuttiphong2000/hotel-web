import React from "react";
import { assets } from "../assets/assets";

const StarRating = ({rating = 4}) => {
  return (
    <>
      {Array(5)
        .fill(0)
        .map((_, index) => (
          <img key={index} className="w-4.5 h-4.5" src={rating > index ? assets.starIconFilled : assets.starIconOutlined} />
        ))}
    </>
  );
};

export default StarRating;
