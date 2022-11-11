import styled from "styled-components";
import { ChatAppState } from "../AppContext/AppProvider";

const Message = () => {
  const { setShowMessage, showMessage, message } = ChatAppState();
  return (
    <Container>
      {showMessage && (
        <div className={`message ${message.type} ${showMessage && "show"}`}>
          <div className="m-wrapper">
            <span
              className={`m-icon fas ${
                message.type === "success" ? "fa-check" : "fa-info"
              }`}
            ></span>
            <div className="m-info">
              <h2 className="m-info-header">{message.title}</h2>
              <p className="m-info-text">{message.text}</p>
            </div>
            <span
              className="m-action fas fa-times"
              onClick={() => setShowMessage(false)}
            ></span>
          </div>
        </div>
      )}
    </Container>
  );
};

const Container = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 10;
  .message {
    width: max-content;
    max-width: 300px;
    margin: 0 auto;
    background: #23313d;
    padding: 10px 10px;
    opacity: 0;
    visibility: hidden;
    transform: translateY(20px);
    &.show{
      animation: show 1s 1 ease-in-out;
      animation-fill-mode: forwards;
    }
    &.success {
      .m-wrapper {
        .m-icon {
          background: #027c17;
        }
        .m-info {
          .m-info-header {
            color: #027c17;
            text-overflow: ellipsis;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
          display: -webkit-box;
          }
          .m-info-text {
            color: #027c17;
          }
        }
        .m-action {
          color: #027c17;
        }
      }
    }

    &.info {
      .m-wrapper {
        .m-icon {
          background: #8b64ef;
        }
        .m-info {
          .m-info-header {
            color: #6c37f3;;
            text-overflow: ellipsis;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
          display: -webkit-box;
          }
          .m-info-text {
            color: #8b64ef;
          }
        }
        .m-action {
          color: #8b64ef;
        }
      }
    }
    &.error {
      .m-wrapper {
        .m-icon {
          background: #f31d1d;
        }
        .m-info {
          .m-info-header {
            color: #f31d1d;
          }
          .m-info-text {
            color: #f31d1d;
          }
        }
        .m-action {
          color: #f31d1d;
        }
      }
    }
    .m-wrapper {
      display: flex;
      justify-content: space-between;
      gap: 14px;
      align-items: center;
      .m-icon {
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        color: #23313d;
      }
      .m-action {
        cursor: pointer;
        align-self: flex-start;
      }
      .m-info {
        .m-info-header {
          font-size: 15px;
        }
        .m-info-text {
          font-size: 12px;
        }
      }
    }
  }
  @keyframes show{
    to{
opacity: 1;
visibility: visible;
transform: translateY(0);
    }
    }
`;

export default Message;
