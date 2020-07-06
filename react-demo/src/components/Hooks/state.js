import React, { useState, useEffect } from 'react';

let TIME = 0;

function Hooks () {
  const [count, setCount] = useState(0)
  useEffect(() => {
      console.log('use effect...',count)
      const timer = setInterval(() => {
          console.log('timer...count:', count)
          setCount(count + 1)
      }, 1000)
      return ()=> clearInterval(timer)
  }, [])
  useEffect(() => {
    console.log('use effect...', TIME)
    const timer2 = setInterval(() => {
        console.log('timer...time:', TIME)
        TIME ++;
    }, 1000)
    return ()=> clearInterval(timer2)
  }, []);

  return (
    <div>
      count: {count}<br/>
      TIME: {TIME}
    </div>
  )
}

export default Hooks;