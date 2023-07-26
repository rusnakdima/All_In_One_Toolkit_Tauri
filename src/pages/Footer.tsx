import React from "react";

const Footer: React.FC = () => {
  const curYear: number = new Date().getFullYear();

  return (
    <div className="styleBorderSolid border-t-2 mt-4">
      <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
        <span>&copy;DmitriyDev 2023-{curYear}</span>
      </div>
    </div>
  )
};

export default Footer;