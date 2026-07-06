import http from "../http-common";

class GuestDataService {
  add(bookingId, data) {
    return http.post(`/guests/${bookingId}`, data);
  }

  update(guestId, data) {
    return http.put(`/guests/${guestId}`, data);
  }

  get(guestId) {
    return http.get(`/guests/${guestId}`);
  }

  getAll() {
    return http.get("/guests");
  }

  getByBookingId(bookingId) {
    return http.get(`/guests/booking/${bookingId}`);
  }

  delete(guestId) {
    return http.delete(`/guests/${guestId}`);
  }
}

export default new GuestDataService();
