import React, { useState } from 'react';
import Child from './child';

const arr = [1, 2, 3];

const User =()=>{
  const [age, setAge] = useState(20);
  
  return(
      <div>
          <button onClick={() => setAge(age+1)}>add age</button>
          <span>{age}</span>
          <Child arr={arr}/>
      </div>
  )
}

export default User;