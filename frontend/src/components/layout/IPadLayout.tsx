import React from 'react';

interface IPadLayoutProps {
  title: string;
  children: React.ReactNode;
}

const IPadLayout: React.FC<IPadLayoutProps> = ({ title, children }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
          <h1 className="text-3xl font-bold text-white">{title}</h1>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default IPadLayout; 