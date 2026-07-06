import http from "../http-common";

class RoomDataService {

  addRoom(hotelId, data) {
    return http.post(`/rooms/hotel/${hotelId}`, data);
  }

  updateRoom(roomId, data) {
    return http.put(`/rooms/${roomId}`, data);
  }

  getRoomById(roomId) {
    return http.get(`/rooms/${roomId}`);
  }

  getAll() {
    return http.get("/rooms");
  }

  getByHotelId(hotelId) {
    return http.get(`/rooms/hotel/${hotelId}`);
  }

  getAvailable(data) {
    return http.post("/rooms/available", data);
  }

  delete(roomId) {
    return http.delete(`/rooms/${roomId}`);
  }
}

export default new RoomDataService();
