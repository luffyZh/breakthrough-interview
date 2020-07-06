import React, { useEffect, useState } from "react";

const Child = ({ arr }) => {
  const [firstArr, setArr] = useState([]);
  useEffect(() => {
    setArr(arr);
  }, []);
  useEffect(() => {
    console.log(firstArr === arr);
  });
  return (  
    <div>child</div>
  );
}

export default React.memo(Child);