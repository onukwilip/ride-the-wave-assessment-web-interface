import React from "react";
import css from "../styles/Home.module.scss";
import Form from "../components/Form.component";
import Groups from "../components/Groups.component";

const Home = () => {
  return (
    <main className={css.main}>
      <h1>Ride the wave assessment</h1>
      <Form />
      <Groups />
    </main>
  );
};

export default Home;
