function CozySpinner() {
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div
        style={{
          width: "90px",
          height: "90px",
          borderRadius: "50%",
          background:
            "conic-gradient(from 180deg, #00F5FF, #00BFFF, #0066FF, transparent 85%)",
          WebkitMask:
            "radial-gradient(farthest-side, transparent calc(100% - 8px), #000 calc(100% - 7px))",
          mask: "radial-gradient(farthest-side, transparent calc(100% - 8px), #000 calc(100% - 7px))",
          animation: "cozy-spin 0.9s linear infinite",
          filter: "drop-shadow(0 0 8px #00F5FF) drop-shadow(0 0 20px #0099FF)",
        }}
      />

      {/* Keyframe injected via style tag */}
      <style>{`
        @keyframes cozy-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default CozySpinner;
