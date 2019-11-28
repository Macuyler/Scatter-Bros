import React, { useState } from "react";
import { Redirect } from "react-router";
import { Button } from "@material-ui/core";
import boys from "./assets/boys.png";
import logo from "./assets/logo.svg";

const Home = () => {
  const [go, setGo] = useState(false);
  return (
    <div className="home-page-wrapper">
      <div className="blue-background" />
      <img className="boys" src={boys} alt="boys" />
      <div className="home-content">
        <img className="home-logo" src={logo} alt="logo" />
        <div className="home-left-content">
          <h1 className="home-heading">Design your own marshmallow shooter</h1>
          <p>No Tools. No trips to the store. <br />
            Design Online. Ships to your door.</p>
          <Button
            onClick={() => setGo(true)}
            variant="contained"
            size="large"
            color="primary"
            style={{ marginTop: 20, width: 300 }}
          >
            Build Your Gun
          </Button>
          {go ? <Redirect to="/edit" /> : null}
        </div>
        <div className="home-description">
          <p>Founded by Carter.
           Him and his brother Easton 
           are helping spread the joy of 
           custom PVC Creations.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
