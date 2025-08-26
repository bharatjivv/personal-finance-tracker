import React from 'react'
import "./styles.css"

const Button = ({text, onClick, blue, disabled}) => {
  return (
    <div className={blue ? 'btn btn-blue': 'btn'} onClick={onClick} disabled={disabled}> {text}
    {/* <button className={blue ? "btn btn-blue" : "btn"} onClick={onClick}>
      {text}
    </button> */}
    </div>
  )
}

export default Button