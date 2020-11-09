import React, { useState, useEffect } from 'react';
import socketio from 'socket.io-client';
import styled from 'styled-components';
import chattingApi from '../../Config';

const socket = socketio.connect(`${chattingApi}`);

const Chatting = () => {
  const [inputMessage, setInputMessage] = useState('');
  const [chatMonitor, setChatMonitor] = useState([]);
  const [recentChat, setRecentChat] = useState('');

  const handleInput = (e) => {
    setInputMessage(e.target.value);
  };

  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      socket.emit('message', { inputMessage });
      setInputMessage('');
    }
  };

  const handleClick = (e) => {
    socket.emit('message', { inputMessage });
    setInputMessage('');
  };

  const scrollToBottom = () => {
    document.getElementById('chatMonitor').scrollBy({ top: 100 });
  };

  useEffect(() => {
    socket.on('upload', (data) => {
      setRecentChat(data.inputMessage);
    });
  }, []);

  useEffect(async () => {
    (await recentChat.length) != 0 &&
      setChatMonitor([...chatMonitor, recentChat]);
    scrollToBottom();
    setRecentChat('');
  }, [recentChat]);

  return (
    <ChattingWrap>
      <ChattingBox>
        <ChatNav>
          <span>위코드 대나무숲</span>
        </ChatNav>
        <Monitor id="chatMonitor">
          {chatMonitor.map((el, idx) => (
            <div key={idx}>
              <span>{el}</span>
            </div>
          ))}
        </Monitor>
        <SendMessageBox>
          <input
            type="text"
            onKeyUp={handleEnter}
            onChange={handleInput}
            value={inputMessage}
            placeholder="메세지 입력"
          />
          <button onClick={handleClick}>전송</button>
        </SendMessageBox>
      </ChattingBox>
    </ChattingWrap>
  );
};

export default Chatting;

const ChattingWrap = styled.div`
  max-width: 500px;
  width: 100%;
  height: 500px;
`;

const ChattingBox = styled.div`
  width: 100%;
  height: 100%;
`;

const Monitor = styled.div`
  height: 100%;
  padding: 10px;
  border-bottom: 1px solid lightgray;
  overflow-y: scroll;
  div {
    margin: 5px 0 20px 0;
    width: 100%;
    span {
      padding: 1px 5px;
      ${({ theme }) => theme.border('3px', 'solid', '#dbe8ff', null, '5px')}
    }
  }
`;

const ChatNav = styled.div`
  width: 100%;
  height: 40px;
  padding: 10px;
  border-bottom: 1px solid lightgray;
  ${({ theme }) => theme.flex(null, 'center')};
  span {
    font-weight: 700;
  }
`;

const SendMessageBox = styled.div`
  border-bottom: 1px solid lightgray;
  input {
    width: 80%;
    height: 30px;
    padding: 5px;
    font-size: 15px;
  }
  button {
    cursor: pointer;
    width: 20%;
    height: 30px;
    font-size: 15px;
    :hover {
      background-color: lightgray;
    }
  }
`;
