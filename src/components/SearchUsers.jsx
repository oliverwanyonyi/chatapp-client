import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import user from "../assets/kibet.png";
import { createChatRoute, getUsersRoute } from "../api";
import { ChatAppState } from "../AppContext/AppProvider";

const SearchUsers = ({
  showSearch,
  setShowSearch,
  fetchChats,
  setFetchChats,
}) => {
  const [searchResult, setSearchResult] = useState([]);
  const [search, setSearch] = useState("");
  const { currentUser,setSelectedChat } = ChatAppState();
  const searchInputRef = useRef();
  const getUsers = async () => {
    try {
      const { data } = await axios.get(
        `${getUsersRoute}/${currentUser?.id}?search=${search}`
      );
      setSearchResult(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    searchInputRef.current?.focus();
  });

  const changeHandler = (e) => {
    setSearch(e.target.value);
    if (search !== "") {
      getUsers();
    }
  };

  const createChat = async (res) => {
    try {
      const { data } = await axios.post(
        `${createChatRoute}?from=${currentUser?.id}&to=${res._id}`,
        {
          name: res.username,
        }
      );
      setFetchChats(!fetchChats);
      setSelectedChat(data)
      setShowSearch(!showSearch);
      setSearch("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container className={showSearch ? "panel visible" : "panel"}>
      <div
        className="panel-overlay"
        onClick={() => setShowSearch(!showSearch)}
      ></div>
      <div className="panel-container">
        <div className="panel-header">
          <span
            className="fas fa-times"
            onClick={() => setShowSearch(!showSearch)}
          ></span>
        </div>
        <input
          type="text"
          placeholder="search users"
          className="panel-search-input"
          value={search}
          onChange={changeHandler}
          ref={searchInputRef}
        />
        {search && (
          <div className="search-results-container">
            {searchResult.length > 0 ? (
              searchResult.map((res,idx) => (
                <div className="search-result" onClick={() => createChat(res)} key={idx}>
                  <div className="search-result-avatar">
                    <img src={res.avatar} alt="" />
                  </div>
                  <h3>{res.username}</h3>
                </div>
              ))
            ) : (
              <p class="info">Your search did't match any results</p>
            )}
          </div>
        )}
      </div>
    </Container>
  );
};
const Container = styled.div`
  &.visible {
    visibility: visible;
    opacity: 1;
  }
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100vh;
  z-index: 4;
  visibility: hidden;
  opacity: 0;
  .panel-container {
    position: absolute;
    left: 0;
    top: 0;
    width: 30vw;
    background: #ffff;
    height: 100%;
    z-index: 3;
    padding: 10px 20px;
    @media (max-width: 1080px) {
      width: 50vw;
    }
    @media (max-width: 768px) {
      width: 70vw;
    }
    @media (max-width: 500px) {
      width: 100vw;
    }
    .panel-header {
      display: flex;
      width: 100%;
      justify-content: flex-end;
      margin-bottom: 10px;
      span.fa-times {
        font-size: 17px;
        color: #6c37f3;
        cursor: pointer;
      }
    }
    input {
      width: 100%;
      border: 2px solid #8b64ef !important;
      padding: 10px 20px;
      border-radius: 10px;
      margin-bottom: 20px;
    }
    .search-results-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      .info {
        text-align: center;
        font-size: 15px;
      }
      .search-result {
        display: flex;
        gap: 1rem;
        align-items: center;
        cursor: pointer;
        img {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #6c37f3;
        }
        h3 {
          font-weight: 500;
          color: #292929;
          font-size: 14px;
        }
      }
    }
  }
  .panel-overlay {
    background: rgba(0, 0, 0, 0.1);
    position: absolute;
    width: 100%;
    height: 100vh;
    z-index: 2;
    cursor: pointer;
  }
`;
export default SearchUsers;
