import react, {useState} from 'react';

import React from 'react'

const Form = () => {

  const[formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  })

  const handleChange = (e)=>{
    const {name, value} = e.target;
    setFormData({...formData, [name]:value})
  }

  const handleSubmit = (e)=>{
    e.preventDefault()
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
          <input type="text"  onChange={handleChange}/>
      </form>
    </div>
  )
}

export default Form
