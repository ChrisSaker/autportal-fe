import React from 'react';

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-white bg-opacity-80">
      <div className="w-16 h-16 border-8 border-t-8 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );
};

export default Loading;
