import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import AuthContext from "../../context/AuthContext";
import { useLoadingBar } from "../../context/LoadingBarContext";
import roomService from "../../services/roomService";
import hotelService from "../../services/hotelService";
import RoomCard from "../../components/RoomCard";
import toast from "react-hot-toast";

function RoomList() {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [rooms, setRooms] = useState([]);
  const [hotel, setHotel] = useState(null);

  const loadingBar = useLoadingBar();

  useEffect(() => {
    Promise.all([
      roomService.getRoomsByHotel(hotelId),
      hotelService.getHotelById(hotelId),
    ])
      .then(([roomsRes, hotelRes]) => {
        setRooms(roomsRes.data);
        setHotel(hotelRes.data);
        loadingBar.current.continuousStart();
      })
      .catch(() => {
        toast.error("Failed to load rooms");
      })
      .finally(() => {
        loadingBar.current.complete();
      });
  }, [hotelId]);

  const handleDelete = (roomId) => {
    const toastId = toast.loading("Deleting room...");

    Swal.fire({
      title: "Delete this room?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      confirmButtonColor: "#dc2626",
    }).then((result) => {
      if (result.isConfirmed) {
        roomService
          .deleteRoom(roomId)
          .then(() => {
            toast.success("Room deleted", { id: toatstId });
            setRooms((prev) => prev.filter((r) => r.roomId !== roomId));
          })
          .catch((error) => {

            toast.error(
              error.response?.data?.message || "Cannot delete a room with active bookings.",
              { id: toastId },
            );
          });
      }
    });
  };

  return (
    <div className="cozy-page">
      <div className="container">
        {/* Header */}
        <button
          className="btn cozy-btn-outline mb-4"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="cozy-title mb-0">Rooms — {hotel?.name}</h2>
            <p className="cozy-subtitle mb-0">
              {rooms.length} room{rooms.length !== 1 ? "s" : ""} listed
            </p>
          </div>
          {(user?.role === "HOTEL_OWNER" || user?.role === "ADMIN") && (
            <button
              className="btn cozy-btn-primary"
              onClick={() => navigate(`/hotel/${hotelId}/room/add`)}
            >
              + Add Room
            </button>
          )}
        </div>

        {/* Room Grid */}
        {rooms.length === 0 ? (
          <div className="cozy-card p-5 text-center">
            <h5 className="fw-semibold">No rooms added yet.</h5>
            <p className="cozy-subtitle">
              Add your first room to start accepting bookings.
            </p>
          </div>
        ) : (
          <div className="row g-4">
            {rooms.map((room) => (
              <div className="col-md-4" key={room.roomId}>
                <RoomCard
                  room={room}
                  hotelId={hotelId}
                  showActions={
                    user?.role === "HOTEL_OWNER" || user?.role === "ADMIN"
                  }
                  onEdit={() =>
                    navigate(`/hotel/${hotelId}/room/edit/${room.roomId}`)
                  }
                  onDelete={() => handleDelete(room.roomId)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RoomList;
