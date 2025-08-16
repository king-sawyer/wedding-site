const Welcomepage = ({ logout, userData }) => {
  return (
    <div>
      <h1>Welcome page</h1>
      <h2>Hi {userData["first"]}, welcome to the wedding!</h2>
      <button onClick={() => logout()}>Log out</button>
    </div>
  );
};

export default Welcomepage;
