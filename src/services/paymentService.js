import http from "../http-common";

class PaymentDataService {
    
  add(bookingId, data) {
    return http.post(`/payment/${bookingId}`, data);
  }

  update(data) {
    return http.put(`/payment`, data);
  }

  get(paymentId) {
    return http.get(`/payment/${paymentId}`);
  }

  getAll() {
    return http.get("/payment");
  }

  getByBookingId(bookingId) {
    return http.get(`/payment/booking/${bookingId}`);
  }

  delete(paymentId) {
    return http.delete(`/payment/${paymentId}`);
  }
  
}

export default new PaymentDataService();
