import styled from "styled-components";
import { ChatAppState } from "../AppContext/AppProvider";

const Message = () => {
  const { setShowMessage, showMessage, message } = ChatAppState();
  return (
    <Container>
      {showMessage && (
        <div className={`message ${message.type}`}>
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
    background: #1f1c24;
    padding: 10px 10px;
    &.success {
      .m-wrapper {
        .m-icon {
          background: #027c17;
        }
        .m-info {
          .m-info-header {
            color: #027c17;
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
        color: #000000;
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
`;

export default Message;
