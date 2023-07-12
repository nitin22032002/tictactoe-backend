import React, { useContext } from "react";
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import ContextMain from "../context/ContextMain";
import { authenticationRequest, CLIENT_ID } from "../server/server";
import "../css/login.css"
export default function Login(props) {
  const context = useContext(ContextMain)
  const handleSuccess = async (response) => {
    // context.setLoading(true)
    try {
      let body = { token: response.credential }
      let res = await authenticationRequest("/login", body);
      if (res) {
        alert(res)
        // context.setError({ msg: res, type: "warning", status: true });
      }
      else {
        context.fetchUser()
        // context.setError({ msg: "Login Success Fully", type: "success", status: true });
        context.setOpen({ status: false });
      }
    }
    catch (e) {
      alert("Server Error...")
      // context.setError({ msg: "Server Error....", type: "error", status: true });
    }
    // context.setLoading(false)
  }
  const handleFailure = (error) => {
    // context.setError({ msg: error.message, type: "error", status: true });
    alert(error.message);
  }
  return (
<div className='login-div'>
        <div className='login-sub-div'>
            <div className="login-heading">
                    Welcome Login Here
            </div>
            <div>

      <GoogleOAuthProvider clientId={CLIENT_ID} >
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleFailure}
          width="360px"
          text={props.text}
          size="large"
          shape="square"
          />
      </GoogleOAuthProvider>
          </div>
    </div>
    </div>
  )
}