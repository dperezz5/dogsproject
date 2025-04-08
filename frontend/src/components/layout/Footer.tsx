import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center py-4">
          <div className="text-white">
            <p className="font-poppins">&copy; {new Date().getFullYear()} DogSwipe. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 