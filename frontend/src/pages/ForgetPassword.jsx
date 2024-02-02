
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


function ForgetPassword() {
    const {token} = useParams()
    const navigate = useNavigate();

    useEffect(()=>{

        if(token){
            localStorage.setItem("token",token)
            navigate('/edit-password')
        }
    },[navigate, token])
  return (
    <>
      Loading...
    </>
  )
}

export default ForgetPassword;