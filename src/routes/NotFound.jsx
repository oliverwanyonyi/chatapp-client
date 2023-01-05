
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
const NotFound = () => {
    const navigate = useNavigate()
    const handleClick =()=>{
        navigate('/')
    }
  return (
    <Container>
      <div className="info">
        <h1>404</h1>
        <p>page not found</p>
        <button onClick={handleClick}>Back to Chat</button>
      </div>
    </Container>
  );
};

const Container = styled.div`
  height: 100vh;
  width: 100%;
  padding: 0 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  .info {
    display: flex;
    flex-direction: column;
  }
  h1 {
    font-size: 100px;
    color: transparent;
    -webkit-text-stroke-width: 1px;
    -webkit-text-stroke-color: #6c37f3;    
    margin-bottom: 10px;
  }
  p {
    font-size: 15px;margin-bottom: 20px;
  }
  button {
    background: #6c37f3;
    padding: 10px 20px;
    color: #fff;
    cursor: pointer;
  }
`;
export default NotFound;
