import React, { useState } from 'react'
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import axios from '../axios';
import { useStateValue } from "../context/StateProvider";
import { LoginSvg } from '../Svg';

const Login = () => {
    const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [state, dispatch] = useStateValue();
  const history = useHistory();

  const handleSubmit = async (e) => {
      e.preventDefault()
    try {
      const response = await axios.post( "/signin",
      {
        password,
        email,
      }
      );
      const data =  response.data;
      if (data.user) {
        setSuccess("Login Succesfully");
        localStorage.setItem("token", data.token);
        data.user.password = undefined;
        localStorage.setItem("user", JSON.stringify(data.user));
        dispatch({
          type: "SET_USER",
          user: data.user,
        });
        setTimeout(() => {
          history.push("/map");
        }, 100);
      } else if (data.error) {
        setError("Verifier Vos Données");
      }
    } catch (error) {
        setError('Verifier Vos Données')
      console.log(error);
    }
  };

  const handleFocus = (e)=>{
    e.target.parentElement.firstChild.style.transform = 'translateY(-25px)'
  }
    return (
        <div className='login'>
              <div className="title__container">
                <div className="title">
                    <h3>Connectez-Vous</h3>
                    <h2>Vous n'avez pas un compte? <Link to='/signup'> Creez-en-un </Link></h2>
                </div>
                <div className="svg__container">
                    <LoginSvg />
                </div>
            </div>
            
             <div className="form__container loginn">
                    <form onSubmit={handleSubmit}>
                        <div className="inputContainer">
                        <label>Email </label>
                            <input
                            onFocus={handleFocus}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email" />
                        </div>
                        <div className="inputContainer">
                        <label> Mot De Passe</label>
                            <input 
                            onFocus={handleFocus}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password" />
                        </div>
                        
                        <div className="form__info">
                        {error && <div className="error">{error}</div>}
                        {success && <div className="success">{success}</div>}
                        </div>
                        <div className="form__submit">
                            <button type="submit">Connectez-Vous</button>
                        </div>
                    </form>
                </div>
              
        </div>
    )
}

export default Login
