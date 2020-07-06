import React, { useReducer } from 'react';

const reducer =(state = 0, {type})=>{
  switch (type) {
      case 'INCREMENT':
          return state + 1
      case 'DECREMENT':
          return state - 1
      default:
          return state;
  }
}

const Reducer = () => {
  const [count, dispatch] = useReducer(reducer, 0)
  return(
      <div>
         Count: {count}
         <button onClick={()=> dispatch({type: 'INCREMENT'})}>增加1</button>
          <button onClick={()=> dispatch({type: 'DECREMENT'})}>减少1</button>
      </div>
  )
}

export default Reducer;