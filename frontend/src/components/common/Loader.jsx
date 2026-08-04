import './Loader.css';

function Loader({ fullScreen = false }) {
  if (fullScreen) {
    return (
      <div className="loader-overlay">
        <div className="loader-spinner" />
        <p className="loader-text">Loading...</p>
      </div>
    );
  }
  return (
    <div className="loader-inline">
      <div className="loader-spinner loader-spinner--sm" />
    </div>
  );
}

export default Loader;
