import React, { useState, useEffect } from 'react';


const FullScreenChat = ({ avatarName }) => {
  const iframeSrc = `/fullscreen.html?avatar=${avatarName}`;
  const [divHeight, setDivHeight] = useState(0);

  useEffect(() => {
     // Function to update the height
     const updateHeight = () => {
       const newHeight = window.innerHeight - 66; // Subtract 66px from the viewport height
       setDivHeight(newHeight);
     };
 
     // Update the height on mount and resize
     updateHeight();
     window.addEventListener('resize', updateHeight);
 
     // Cleanup function to remove the event listener
     return () => window.removeEventListener('resize', updateHeight);
  }, []); // Empty dependency array means this effect runs once on mount and cleanup on unmount
 
  return (
    <div className="flex flex-1">
      <div className="flex" style={{ width: '100%', height: `${divHeight}px` }}>
        <iframe
          src={iframeSrc}
          title="Fullscreen Chat"
          style={{ width: '100%', height: '100%', border: 'none' }}
        />
      </div>
    </div>
  );
};

export default FullScreenChat;
