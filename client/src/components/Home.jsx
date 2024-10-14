import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <div>
        <button
          onClick={() => {
            navigate("/easy");
          }}
        >
          Easy
        </button>
        <button
          style={{ marginLeft: 10, marginRight: 10 }}
          onClick={() => {
            navigate("/intermediate");
          }}
        >
          Medium
        </button>
        <button
          onClick={() => {
            navigate("/expert");
          }}
        >
          HaArd
        </button>
      </div>
      <div style={{ marginTop: 5 }}>
        vitesweeper by <a href="https://github.com/canavan-a">canavan-a</a>
      </div>
    </>
  );
};

export default Home;
