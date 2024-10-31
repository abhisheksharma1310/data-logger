const LiveStatusBar = ({ isPortConnected }) => {
  return (
    <div>
      <p>{isPortConnected ? "Port connected" : "Port not connected"} </p>
    </div>
  );
};

export default LiveStatusBar;
