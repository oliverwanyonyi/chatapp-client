import './App.css';
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Chat from './routes/Chat';
import Register from './routes/Register';
import Login from './routes/Login';



function App() {
  return (
   
    <Routes>
    <Route path='/register' element={<Register/>}/>
    <Route path='/login' element={<Login/>}/> 
    <Route path='/' element={<Chat/>}/>
    </Routes>
  );
}

export default App;
