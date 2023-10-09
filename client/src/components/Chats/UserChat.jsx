import { Stack } from "react-bootstrap";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import avatar from "../../assets/avatar.svg";
import { useContext } from "react";
import { chatContext } from "../../context/chatContext";

function UserChat({ chat, user }) {
  const [recipientUser, error] = useFetchRecipientUser(chat, user);
  const { onlineUsers } = useContext(chatContext);

  const isOnline = onlineUsers?.some(
    (user) => user?.userId === recipientUser?._id
  );

  return (
    <>
      <Stack
        direction="horizontal"
        gap={3}
        className="user-card align-items-center p-2 justify-content-between"
        role="button"
      >
        <div className="d-flex">
          <div className="me-2">
            <img src={avatar} height={40} alt={"Avatar"} />
          </div>
          <div className="text-content">
            <div className="name">{recipientUser?.name}</div>
            <div className="text">text message</div>
          </div>
        </div>
        <div className="d-flex flex-column align-items-end">
          <div className="date">12/12/2022</div>
          <div className="this-user-notifications">2</div>
          <span className={isOnline ? "user-online" : ""}></span>
        </div>
      </Stack>
    </>
  );
}

export default UserChat;
