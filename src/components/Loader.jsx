import React from "react";
import styled from "styled-components";
const Loader = ({ type }) => {
  return (
    <Container className={type}>
      <div className="dot"></div> <div className="dot"></div>
      <div className="dot"></div>
    </Container>
  );
};
const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 20px 0;
  width: 100%;
  &.sm {
    padding: 5px 0;
    .dot {
      width: 8px;
      height: 8px;
    }
  }
  .dot {
    width: 13px;
    height: 13px;
    border-radius: 50%;
    background: #bcbcbc;
    animation: bounce2 0.9s infinite linear forwards;

    &:nth-child(1) {
      animation-delay: 0.25s;
    }
    &:nth-child(2) {
      animation-delay: 0.5s;
    }
    &:nth-child(3) {
      animation-delay: 0.75s;
    }
  }

  @keyframes bounce2 {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(100%);
    }
    100% {
      transform: translateY(0);
    }
  }
`;
export default Loader;
