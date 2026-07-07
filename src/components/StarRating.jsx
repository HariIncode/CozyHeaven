function StarRating({ rating = 0 }) {
  return (
    <div className="d-inline-flex align-items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{
            fontSize: "1rem",
            color: star <= Math.round(rating) ? "#f59e0b" : "#d1d5db",
          }}
        >
          ★
        </span>
      ))}
      <span className="cozy-subtitle small ms-1">{rating?.toFixed(1)}</span>
    </div>
  );
}

export default StarRating;