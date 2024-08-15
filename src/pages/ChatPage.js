

import React from 'react';
import { useParams } from 'react-router-dom';
import FullScreenChat from '../components/FullScreenChat';

export const ChatPage = () => {
    const { avatarName } = useParams();
    return (
        <div className="flex">
            <FullScreenChat avatarName={avatarName} />
        </div>
    );
};

export default ChatPage;
