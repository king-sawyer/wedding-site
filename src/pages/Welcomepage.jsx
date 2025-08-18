const Welcomepage = ({ logout, userData }) => {
  return (
    <div>
      <h1>LET'S CELEBRATE!</h1>
      <h2>Hi {userData["first"]}, welcome to The King Wedding!</h2>
      <button onClick={() => logout()}>Log out</button>
    </div>
  );
};

export default Welcomepage;
