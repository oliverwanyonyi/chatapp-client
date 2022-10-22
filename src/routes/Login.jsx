import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginRoute } from '../api'
import FormContainer from '../components/FormContainer'

const Login = () => {
  const [user, setUser] = useState({ emailOrName: "",password:'' });
  const [loading,setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit =async (e)=>{
    e.preventDefault()

      try {
        setLoading(true)
        const {data} = await axios.post(loginRoute, user);
        setLoading(false)
        if(data.success){
          
               localStorage.setItem('talktoo-user',JSON.stringify(data.user))
               navigate('/') 
        }else{
          alert(data.message)
        }
      } catch (error) {
      setLoading(false)
      }

}
const handleChange = (e) =>{
setUser({...user,[e.target.name]:e.target.value.trim().toLowerCase()})
}
useEffect(() => {
  const user = JSON.parse(localStorage.getItem('talktoo-user'))
  if(user){
   navigate('/')
  }
 },[])
  return (
    <FormContainer>
        <form className="form" onSubmit={handleSubmit}>
                <h3>Login to continue </h3>
                
                <div className="form-group">
          <label htmlFor="emailOrName" className="form-label">
            Email or Username
          </label>
          <input
            type="text"
            name="emailOrName"
            className="form-control"
            id="email"
            required
            value={user.email} onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            name="password"
            className="form-control"
            onChange={handleChange}
            id="password"
            value={user.password}
            minLength={8}
          />
        </div>

                <button type="submit" disabled={loading}>{loading?"Loging you in please wait":"Login"}</button>
                <span>Don't have an account  <Link to='/register'>Register</Link></span>
            </form>
    </FormContainer>
  )
}

export default Login