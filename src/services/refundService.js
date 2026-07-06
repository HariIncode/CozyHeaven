import http from "../http-common";

class RefundDataService {
  create(data) {
    return http.post(`/refund`, data);
  }

  approve(refundId) {
    return http.put(`/refund/approve/${refundId}`);
  }

  process(refundId) {
    return http.put(`/refund/process/${refundId}`);
  }

  process(refundId) {
    return http.put(`/refund/reject/${refundId}`);
  }

  get(refundId, reason) {
    return http.get(`/refund/${refundId}`, {
      params: {
        reason,
      },
    });
  }

  getAll() {
    return http.get("/refund");
  }

  getByBookingId(bookingId) {
    return http.get(`/refund/booking/${bookingId}`);
  }
}

export default new RefundDataService();
