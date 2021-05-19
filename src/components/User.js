import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router';
import axios from '../axios';
import { useStateValue } from "../context/StateProvider";
import {  AddedTrajetIcon, LogoutIcon, TrajetIcon, UserIcon } from '../Svg';
import Card from './Card';
import UpdateInfo from './UpdateInfo';

const User = () => {

    const [myTrajets,setMyTrajets] = useState([])
    const [joinedTrajets,setJoinedTrajets] = useState([])
    const [state,dispatch] = useStateValue()
    const history = useHistory()

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
          history.push('/login')
        } else {
            loadData()
        }
    }, [])

    const loadData = async ()=>{

        const headers = {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
        }

        try {
            const myTr = await axios.get('/user/trajets',{headers})
            setMyTrajets(myTr.data.trajets)

            const joinedTr = await axios.get('/joinedTrajets',{headers})
            setJoinedTrajets(joinedTr.data)

            
        } catch (error) {
            console.log(error)
        }
    }

    const logout = ()=>{
        dispatch({
            type:'SET_USER',
            user: null
        })
        localStorage.clear()
        history.push('/login')
    }

    return (
        <div className='user'>
            <div className="user__title">
                <div className="user__icon">
                    <UserIcon />
                </div>
                <div className="user__name">
                    {state.user && state.user.name}
                </div>
                <div onClick={logout} className="logout">
                    <LogoutIcon />
                </div>
            </div>
            <div className="cards__container">
                <Card canEdit={true} info={myTrajets} title="Mes Trajets" Icon={TrajetIcon} />
                <Card canEdit={false} info={joinedTrajets} title="Trajets Que J'ai Rejoint" Icon={AddedTrajetIcon} />
                <UpdateInfo />
            </div>
        </div>
    )
}

export default User
