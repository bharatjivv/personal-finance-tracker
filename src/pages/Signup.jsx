import React from 'react'
import Header from '../components/Header/Header'
import SignUpSignIn from '../components/SignupSignIn/SignUpSignIn'

const Signup = () => {
  return (
    <div>
      <Header />
      <div className='wrapper'>
        <SignUpSignIn />
      </div>
    </div>
  )
}

export default Signup