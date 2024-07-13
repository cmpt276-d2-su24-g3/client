import React from 'react';

export function Login() {
  
  const login = () => {
      const loginUrl = `https://yyc-portal.auth.us-west-2.amazoncognito.com/login?client_id=481g1a0ridauh779f34tvsti05&response_type=code&scope=email+openid&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Fcallback`;
      window.location.href = loginUrl;
    };

    return (
        <div>
            <button onClick={login}>Login with Cognito</button>
        </div>
    );
};