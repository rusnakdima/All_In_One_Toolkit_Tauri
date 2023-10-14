import React from "react";

const Footer: React.FC = () => {
  const curYear: number = new Date().getFullYear();

  return (
    <div className="styleBorderSolid border-t-2 mt-4">
      <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
        <span>&copy;DmitriyDev 2023-{curYear}</span>
        <span className="text-gray-600 dark:text-gray-300">Version 0.8.0</span>
      </div>
    </div>
  )
};

export default Footer;