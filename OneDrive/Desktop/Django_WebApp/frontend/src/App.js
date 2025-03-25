import React from "react";

const LandingPage = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome to Event Manager</h1>
      <p style={styles.text}>
        Organize and manage your events seamlessly with our platform.
      </p>
      <button style={styles.button}>Get Started</button>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "50px",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    fontSize: "36px",
    fontWeight: "bold",
  },
  text: {
    fontSize: "18px",
    margin: "10px 0",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
  },
};

export default LandingPage;
