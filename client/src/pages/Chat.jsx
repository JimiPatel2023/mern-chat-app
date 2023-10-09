import { useContext } from "react";
import { Container, Stack } from "react-bootstrap";
import ChatBox from "../components/Chats/ChatBox";
import PotentialChats from "../components/Chats/PotentialChats";
import UserChat from "../components/Chats/UserChat";
import { AuthContext } from "../context/authContext";
import { chatContext } from "../context/chatContext";

function Chat() {
  const { user } = useContext(AuthContext);
  const { userChats, userChatsLoading, updateCurrentChat } =
    useContext(chatContext);
  return (
    <>
      <Container>
        <PotentialChats />
        {userChats?.length < 1 ? null : (
          <Stack direction="horizontal" gap={4} className="align-items-start">
            <Stack className="message-box flex-grow-0 pe-3" gap={3}>
              {userChatsLoading && <p>Loading Chats...</p>}
              {userChats?.map((chat, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => {
                      updateCurrentChat(chat);
                    }}
                  >
                    <UserChat chat={chat} user={user} />
                  </div>
                );
              })}
            </Stack>
            <ChatBox />
          </Stack>
        )}
      </Container>
    </>
  );
}

export default Chat;
