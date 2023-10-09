import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { chatContext } from "../../context/chatContext";

function PotentialChats() {
  const { potentialChats, createChat, onlineUsers } = useContext(chatContext);
  const { user } = useContext(AuthContext);
  return (
    <>
      <div className="all-users">
        {potentialChats &&
          potentialChats.map((u, index) => {
            return (
              <div
                className="single-user"
                key={index}
                onClick={() => {
                  createChat(user._id, u._id);
                }}
              >
                {u.name}
                <span
                  className={
                    onlineUsers?.some((user) => user?.userId === u?._id)
                      ? "user-online"
                      : ""
                  }
                ></span>
              </div>
            );
          })}
      </div>
    </>
  );
}

export default PotentialChats;
