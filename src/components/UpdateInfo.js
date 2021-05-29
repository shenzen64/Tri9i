import React, { useEffect, useState } from 'react'
import axios from '../axios';
import { CheckIcon, SettingIcon } from '../Svg'


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


const UpdateInfo = () => {

    const [updatePassword,setUpdatePassword] = useState(false)
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [repeatNewPassword, setRepeateNewPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [cin, setCin] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const loadUserInfo = async ()=>{
        const headers = {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
        }
        try { 
            const response = await axios.get(`/userInfo`,{headers})
            
            setName(response.data.name)
            setEmail(response.data.email)
            setPhone(response.data.phone)
            setCin(response.data.cin)

        } catch (error) {
            console.log(error)
        }
    }

    const updatePasswordInDb = async ()=>{
      if(!oldPassword){
        setSuccess("")
      return setError('Veuillez Entrez Votre Ancien Mot De Passe')
      } 
      if(newPassword.length <= 6){
        setSuccess("")
        return setError('Le Mot De Passe Doit Contenir Au Moins 6 Caractères')
      }
      if(newPassword != repeatNewPassword) {
        setSuccess("")
        return setError('Les Mots De Passe Ne Se Correspond Pas')
      }
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
    }
    const data = {
      oldPassword,
      newPassword
    }
    try { 
        const response = await axios.put(`/updatePassword`,data,{headers})
        setError('')
        setSuccess('Informations Mis A Jour Avec Succée')
        if(response.data) return true
    } catch (error) {
        console.log(error)
        setSuccess("")
        setNewPassword("")
        setOldPassword('')
        setRepeateNewPassword('')
        setError("Ancien Mot De Passe érroné")
        return false
    }
    }

    const updateInfo = async (e)=>{

      e.preventDefault()

      if (name.length < 3) {
        setSuccess("")
        setError("Le Nom et Prénom doit contenir au moins 3 caractères");
        return;
      } else {
        const re = /^([A-Z]( +)?)+/i
        if(!matchExact(re,name))  { 
        setSuccess("")
        return setError("Veuillez Entrez Un Prénom et Nom Valide (sans caractères spéciaux)")
       }
      }

      if (!validateEmail(email)) {
        setSuccess("")
        setError("Veuillez Entrer Un Email Valide");
        return;
      }
      if (!phone) {
        setSuccess("")
        setError("Veuillez Entrer Votre Numero De Telephone");
        return;
      }
      if (!validateCIN(cin)) {
        setSuccess("")
        setError("Veuillez Entrer Un CIN Valide");
        return;
      }
      
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      }
      const data = {
        name,
        email,
        cin,
        phone: phone.toString()
      }
      if(updatePassword){
        const up = await updatePasswordInDb()
        if(!up) return 
      }
    try {
        
        const response = await axios.put(`/updateInfo`,data,{headers})
        setError('')
        setSuccess('Informations Mis A Jour Avec Succée')

    } catch (error) {
        console.log(error)
    }
    }

    useEffect(() => {
        loadUserInfo()
    }, [])

    return (
        <div style={{width:'100%', height:'auto'}} className='card'>
             <div className="card__title">
                <div className="card__icon">
                    <SettingIcon />
                </div>
                <div className="card__name">
                    Mes Informations Personnel
                </div>
              </div>
              <form onSubmit={updateInfo} autoComplete="off" >
              <div className="cardWrapper">
                  <div className="left">
                     <div className="input__container">
                          <label> Nom Et Prenom: </label>
                        <div className="inputWithIcon">
                            <input value={name} onChange={(e) => setName(e.target.value)} autoComplete='off'  type="text" />
                        </div>
                      </div>

                     <div className="input__container">
                          <label> Email: </label>
                        <div className="inputWithIcon">
                            <input autoComplete='off' type="email"  value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                      </div>

                  </div>
                  <div className="rigth">
                       <div className="input__container">
                          <label> Numero De Télephone: </label>
                          <div className="inputWithIcon">
                            <input 
                              value={phone}
                              onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
                              autoComplete='off' type="phone" />
                          </div>
                      </div>
                       <div className="input__container">
                          <label> CIN: </label>
                          <div className="inputWithIcon">
                            <input
                              value={cin}
                              onChange={(e) => setCin(e.target.value)}
                              autoComplete='off' type="text" />
                          </div>
                      </div>
                  </div>
                  
              </div>
              <div className="updatePassword">
                      <div 
                      onClick={()=>setUpdatePassword(!updatePassword)}
                      className="box">
                          { updatePassword && <CheckIcon />}
                      </div>
                      Modifier Le Mot De Passe
             </div>
            { updatePassword && <> 
            <div className="input__container">
                          <label> Ancien Mot De Passe: </label>
                          <div className="inputWithIcon">
                            <input 
                             value={oldPassword}
                             onChange={(e) => setOldPassword(e.target.value)}
                             autoComplete='off' type="password" />
                          </div>
             </div>
             <div className="input__container">
                          <label> Nouveau Mot De Passe: </label>
                          <div className="inputWithIcon">
                            <input autoComplete='off' 
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                             type="password" />
                          </div>
             </div>
             <div className="input__container">
                          <label> Confirmer Nouveau Mot De Passe: </label>
                          <div className="inputWithIcon">
                            <input 
                              value={repeatNewPassword}
                              onChange={(e) => setRepeateNewPassword(e.target.value)}
                              autoComplete='off' type="password" />
                          </div>
             </div> </>}
             <div className="form__info">
                        {error && <div className="error">{error}</div>}
                        {success && <div className="success">{success}</div>}
              </div>
             <button type="submit" class="updateSubmit">Mettre A Jour</button>
             </form>
        </div>
    )
}

export default UpdateInfo
