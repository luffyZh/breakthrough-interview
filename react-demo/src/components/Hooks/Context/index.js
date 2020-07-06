import React, { useReducer } from 'react';
import Child from './child';
import Context from './context';

const reducer = (state = 0, {type}) => {
  switch (type) {
      case 'INCREMENT':
          return state + 1;
      case 'DECREMENT':
          return state - 1;
      default:
          return state;
  }
}

const ContextProvider = Context.Provider;

const ContextComp = () => {
    const [count, dispatch] = useReducer(reducer, 2)
    return (
        <ContextProvider value={[count, dispatch]}>
          <>
              <div>Parent Count: {count}</div>
              <button onClick={() => dispatch({type: 'INCREMENT'})}>父组件操作 count ++</button>
              <button onClick={() => dispatch({type: 'DECREMENT'})}>父组件操作 count --</button>
              <hr />
              <Child />
          </>
        </ContextProvider>
    )
}

export default ContextComp;