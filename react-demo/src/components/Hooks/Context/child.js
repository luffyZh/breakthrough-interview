import React, { useContext } from 'react';
import Context from './context';

const Child = () => {
  const [count, dispatch] = useContext(Context);
  console.log(Context);
  return (
    <div>
        <div>Child Count: {count}</div>
        <button onClick={() => dispatch({type: 'INCREMENT'})}>子组件操作 count ++</button>
        <button onClick={() => dispatch({type: 'DECREMENT'})}>子组件操作 count --</button>
    </div>
  )
}

export default Child;