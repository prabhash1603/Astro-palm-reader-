import React from 'react';

const Loader: React.FC = () => (
  <div className="flex flex-col items-center justify-center space-y-4">
    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-purple-400"></div>
    <p className="text-purple-300 font-medium">भविष्य का विश्लेषण हो रहा है... (Analyzing the future...)</p>
  </div>
);

export default Loader;
