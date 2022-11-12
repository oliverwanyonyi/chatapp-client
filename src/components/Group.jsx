import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Socket } from "socket.io-client";
import styled from "styled-components";
import {
  createGroupRoute,
  getUsersRoute,
  removeUserRoute,
  updateGroupRoute,
} from "../api";
import { ChatAppState } from "../AppContext/AppProvider";
import { handleFileUpload } from "../utils/fileUpload";
import { getErrorMessage } from "../utils/getErrorMessage";
import Loader from "./Loader";

const Group = ({
  setShowModal,
groupName,setGroupName,
  handleClick,
  selectedUsers,
  setSelectedUsers,
}) => {
  const [users, setUsers] = useState([]);
  const {
    currentUser,
    setSelectedChat,
    setChats,
    setMessage,
    setShowMessage,
    groupId,
    setGroupId,

    selectedChat,
    socket,
  } = ChatAppState();
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState();
  const [avatarPreview, setAvatarPreview] = useState();
  const [loadingAvatarUpload, setLoadingAvatarUpload] = useState(false);
  const [search, setSearch] = useState("");
  const getUsers = async () => {
    try {
      setLoadingUsers(true);
      const { data } = await axios.get(
        `${getUsersRoute}/${currentUser?.id}?search=${search}`
      );
      setUsers(data.users);
      setLoadingUsers(false);
    } catch (error) {
      setLoadingUsers(false);
    }
  };
  const handleSelect = (selected) => {
    setSelectedUsers([
      ...selectedUsers.filter((u) => u._id !== selected._id),
      selected,
    ]);
    setUsers(users.filter((u) => u._id !== selected._id));
    if (users.length === 1) {
      setSearch("");
    }
  };

  const handleRemove = async (remove) => {
    try {
      if (groupId) {
        const { data } = await axios.put(
          `${removeUserRoute}/${currentUser.id}`,
          {
            groupId,
            userId: remove._id,
          }
        );
        setSelectedChat(data);
        setChats((prev) => prev.map((c) => (c._id === data._id ? data : c)));
        socket.emit("user-removed", {
          users: selectedUsers.map((u) => u._id),
          chat: data,
          admin: currentUser.username,
        });
        setSelectedUsers(data.users.filter((u) => u._id !== currentUser.id));
      } else {
        setUsers([...users, remove]);
        setSelectedUsers(selectedUsers.filter((u) => u._id !== remove._id));
      }
    } catch (error) {
      setMessage({
        type: "error",
        title: "Remove user failed",
        text: getErrorMessage(error),
      });
      setShowMessage(true);
      setTimeout(() => {
        setLoading(false);
        setShowMessage(false);
      }, 5000);
    }
  };
  const changeHandler = (e) => {
    setSearch(e.target.value);
    if (search !== "") {
      getUsers();
    }
  };
  const createGroup = async (e) => {
    e.preventDefault();

    let payload = {};
    if (avatar) {
      payload = { users: selectedUsers.map((u) => u._id), groupName, avatar };
    } else {
      payload = { users: selectedUsers.map((u) => u._id), groupName };
    }
    if (groupId) {
      try {
        setLoading(true);
        const { data } = await axios.put(
          `${updateGroupRoute}/${currentUser.id}`,
          {
            ...payload,
            groupId,
          }
        );
        setChats((prev) =>
          prev.map((chat) => (chat._id === data._id ? data : chat))
        );

        setSelectedChat(data);
        setGroupId(null);
        setLoading(false);
        setGroupName("");
        setSelectedUsers([]);
        setShowModal(false);
        setMessage({
          type: "success",
          title: `${groupName} update success`,
          text: "group was updated successfully",
        });
        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false);
        }, 5000);
      } catch (error) {
        setLoading(false);
        setMessage({
          type: "error",
          title: `${groupName} update fail`,
          text: getErrorMessage(error),
        });
        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false);
        }, 5000);
      }
    } else {
      try {
        setLoading(true);
        const { data } = await axios.post(
          `${createGroupRoute}/${currentUser.id}`,
          payload
        );
        setChats((prev) => [
          data,
          ...prev.filter((chat) => chat._id !== data._id),
        ]);
        socket.emit("group-created", {
          chat: { ...data, members: selectedUsers.map((u) => u._id) },
          adminName: currentUser.username,
        });
        setUsers([]);
        setGroupName("");
        setSelectedUsers([]);
        setLoading(false);
        setMessage({
          type: "success",
          title: `${groupName} created`,
          text: "group was ccreated successfully",
        });
        setShowMessage(true);

        setTimeout(() => {
          setShowMessage(false);
        }, 5000);
        setShowModal(false);
        setSelectedChat(data);
      } catch (error) {
        console.log(error);
        setMessage({
          type: "error",
          title: "Something went wrong failed to create group",
          text: getErrorMessage(error),
        });
        setShowMessage(true);
        setTimeout(() => {
          setLoading(false);
          setShowMessage(false);
        }, 5000);
      }
    }
  };

  const handleUploadFile = (e) => {
    handleFileUpload(
      e,
      setLoadingAvatarUpload,
      setAvatarPreview,
      setAvatar,
      setMessage,
      setShowMessage
    );
  };

  useEffect(() => {
    if (groupId) {
      setSelectedUsers(
        selectedChat.users.filter((u) => u._id !== currentUser.id)
      );
      setGroupName(selectedChat.name);
      setAvatarPreview(selectedChat.groupAvatar);
    }
  }, [groupId]);
  return (
    <Container>
      <form>
        <div className="header">
          <h2 className="title">
            {groupName ? groupName : "Create New Group"}
          </h2>
          <span className="fas fa-times" onClick={handleClick}></span>
        </div>
        <div className="upload-zone">
          <div className="upload-preview" title="upload profile image here">
            <label htmlFor="file" className="file-upload-icon">
              <i className="fas fa-camera"></i>
            </label>
            <input
              type="file"
              name=""
              id="file"
              onChange={handleUploadFile}
              style={{ display: "none" }}
            />
            {avatarPreview && <img src={avatarPreview} alt="" className="" />}
          </div>
        </div>
        <div className="all-users">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              value={search}
              onChange={changeHandler}
              placeholder="Search users to add to group"
              id=""
            />
          </div>
          {selectedUsers && (
            <div className="users-to-add">
              {selectedUsers.map((user) => (
                <div
                  className="user"
                  key={user._id}
                  title={`remove ${user.username}`}
                >
                  <h2 className="user-name">{user.username}</h2>
                  <span className="user-name">{user.name}</span>
                  <span
                    className="fas fa-times"
                    title="Click to remove user"
                    onClick={() => handleRemove(user)}
                  ></span>
                </div>
              ))}
            </div>
          )}
          <div className="users-container">
            {loadingUsers ? (
              <Loader type="sm" />
            ) : search && users.length === 0 ? (
              <p>{search} didn't match any result</p>
            ) : (
              users?.map((u) => (
                <div
                  className="user"
                  onClick={() => handleSelect(u)}
                  key={u._id}
                >
                  <img src={u.avatar} />
                  <span className="user-name">{u.username}</span>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="form-group">
          <input
            type="text"
            name="groupname"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="form-control"
            placeholder="Enter the name of the group"
            id=""
          />
        </div>
        <button
          className="submit-btn"
          disabled={selectedUsers.length < 1 || !groupName || loading}
          onClick={createGroup}
        >
          {loading ? (
            <Loader type="sm" />
          ) : groupId ? (
            "Save changes"
          ) : (
            "Create Group"
          )}
        </button>
      </form>
    </Container>
  );
};
const Container = styled.div`
  overflow-y: auto;
  max-height: 100vh;
  &::-webkit-scrollbar {
    width: 0.3rem;
    &-thumb {
      background: #8b64ef;
      border-radius: 0.5rem;
    }
  }

  .all-users {
    .search-box {
      position: relative;
      .fa-search {
        position: absolute;
        top: 50%;
        left: 1rem;
        transform: translateY(-50%);
      }
      input {
        background: #ececec;
        height: 40px;
        width: 100%;
        font-size: 14px;
        color: #404040;
        padding: 10px 20px 10px 40px;
        border-radius: 10px;
        cursor: pointer;
        &:focus {
          cursor: text;
        }
      }
    }
    .users-to-add {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      padding: 20px 0;
      .user {
        width: max-content;
        display: flex;
        background: #6c37f3;
        color: #ffff;
        border-radius: 16px;
        justify-content: space-between;
        padding: 5px 10px;
        img {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          object-fit: cover;
          border-radius: 50%;
        }
        .user-name {
          font-size: 14px;
        }
        span.fa-times {
          background: #fafafa;
          color: #6c37f3;
          font-size: 8px;
          cursor: pointer;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;

          width: 20px;
          cursor: pointer;
          border-radius: 50%;
        }
      }
    }
    .users-container {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      padding-bottom: 20px;

      .user {
        width: calc(25% - 5px);
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: 2px solid #6c37f3;
        border-radius: 25px;
        cursor: pointer;
        padding: 5px 10px;
        background: #fafafa;
        img {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          object-fit: cover;
          border-radius: 50%;
        }
        .user-name {
          font-size: 14px;
          color: #6c37f3;
        }
      }
    }
  }
`;
export default Group;
