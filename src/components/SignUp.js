import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { LoginSvg } from '../Svg'
import axios from '../axios'

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function matchExact(r, str) {
  const match = str.match(r);
  return match && str === match[0];
}

function validateCIN(cin){
  const re = /^[A-Z][A-Z][1-9]+/i
  return re.test(cin) && cin.length <9 && cin.length > 4
}



const Login = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [cin, setCin] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const history = useHistory()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true);
        if (name.length < 3) {
          setError("Le Nom et Prénom doit contenir au moins 3 caractères");
          return;
        } else {
          const re = /^([A-Z]( +)?)+/i
          if(!matchExact(re,name))   
          return setError("Veuillez Entrez Un Prénom et Nom Valide (sans caractères spéciaux)")
        }

        if (!validateEmail(email)) {
          setError("Veuillez Entrer Un Email Valide");
          return;
        }

        if (password.length < 6) {
          setError("Le Mot De Passe doit contenir au moins 6 caractères");
          return;
        }
        if (!phone) {
          setError("Veuillez Entrer Votre Numero De Telephone");
          return;
        }
        if (!validateCIN(cin)) {
          setError("Veuillez Entrer Un CIN Valide");
          return;
        }
        try {
          const response = await axios.post(
            '/signup',{
                name,
                password,
                email,
                phone,
                cin
              }
          );
          const data = response.data;
          console.log(data)
    
          if (data.success) {
            setLoading(false);
            setError("");
            setSuccess(data.success);
            setTimeout(() => {
              history.push("/login");
            }, 1300);
          } else if (data.error) {
            setLoading(false);
            setError(data.error);
          }
        } catch (error) {
          setError("Email Deja Utilisé")
          setLoading(false);
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
                    <h3>Creer Un Compte</h3>
                    <h2>Vous avez deja un compte? <Link to='/login'> Connectez-vous </Link></h2>
                </div>
                <div className="svg__container">
                    <LoginSvg />
                </div>
                <div className="form__container">
                    <form onSubmit={handleSubmit}>
                        <div className="input__container">
                        <label > Nom et Prénom </label>
                        <input onFocus={handleFocus} value={name} onChange={(e) => setName(e.target.value)} type="text" />
                         </div>
                        <div className="input__container">
                        <label>Email </label>
                            <input
                            onFocus={handleFocus}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email" />
                        </div>
                        <div className="input__container">
                        <label> Mot De Passe</label>
                            <input 
                            onFocus={handleFocus}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password" />
                        </div>
                        <div className="input__container">
                        <label> Numero de Telephone</label>
                        <input
                            onFocus={handleFocus}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            type="phone" />
                        </div>
                        <div className="input__container">
                            <label> CIN </label>
                            <input 
                            onFocus={handleFocus}
                            value={cin}
                            onChange={(e) => setCin(e.target.value)}
                            type="text" />
                        </div>
                        <div className="form__info">
                        {error && <div className="error">{error}</div>}
                        {success && <div className="success">{success}</div>}
                        </div>
                        <div className="form__submit">
                            <button type="submit">Creer Un Compte</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login
