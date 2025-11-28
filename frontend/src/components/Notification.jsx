const Notification = ({ message, type }) => {
  if (message === null) return null;

  const style = {
    color: type === "success" ? "green" : "red",
    background: "#f1f1f1",
    fontSize: 20,
    border: `2px solid ${type === "success" ? "green" : "red"}`,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  };

  return <div style={style}>{message}</div>;
};

export default Notification;
