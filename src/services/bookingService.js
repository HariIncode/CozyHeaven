import http from "../http-common";

class BookingDataService {
    
  createBooking(data) {
    return http.post(`/booking`, data);
  }

  cancelBooking(data) {
    return http.post(`/booking/cancel`, data);
  }

  complete(bookingId) {
    return http.put(`/booking/complete/${bookingId}`);
  }

  get(bookingId) {
    return http.get(`/booking/${bookingId}`);
  }

  getAll() {
    return http.get("/booking");
  }

  getByUserId(userId) {
    return http.get(`/booking/user/${userId}`);
  }

  getByHotelId(hotelId) {
    return http.get(`/booking/hotel/${hotelId}`);
  }

  delete(bookingId) {
    return http.delete(`/booking/${bookingId}`);
  }
}

export default new BookingDataService();
