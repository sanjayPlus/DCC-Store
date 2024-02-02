

import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
function Token() {
    const {token} = useParams()
    const navigate = useNavigate();
    useEffect(()=>{
    localStorage.setItem('token',token);
        navigate("/")
    },[token,navigate])
  return (
    <div>
      
    </div>
  )
}

export default Token
