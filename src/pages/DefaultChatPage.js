import React from 'react';

const DefaultChatPage = () => {
  const defaultIframeSrc = `/fullscreen.html`; // Adjust as needed

  return (
    <div className="flex flex-1">
      <title>Chat with AI Rem</title>
      <meta name="description" content="Engage in immersive and intelligent chat conversations with AI Rem. Discover a new way to interact with AI today." />
      <div style={{ width: '100%', height: '100vh' }}>
        <iframe
          src={defaultIframeSrc}
          title="AI Chat with Rem"
          style={{ width: '100%', height: '100%', border: 'none' }}
        />
      </div>
    </div>
  );
};

export default DefaultChatPage;
