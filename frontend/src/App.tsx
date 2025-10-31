import { useEffect, useState } from "react";
import { API_URL } from "./constants";

function App() {
  const [data, setData] = useState("");

  const getData = async () => {
    const res = await fetch(API_URL);
    const json = await res.json();
    setData(json.message);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <div>HELLO WORD</div>
      <p>{data}</p>
    </>
  );
}

export default App;
