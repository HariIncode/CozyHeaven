import http from "../http-common";

class ReviewDataService {
    
  add(data) {
    return http.post(`/review`, data);
  }

  update(reviewId ,data) {
    return http.put(`/review/${reviewId}`, data);
  }

  get(reviewId) {
    return http.get(`/review/${reviewId}`);
  }

  getAll() {
    return http.get("/review");
  }

  getByHotelId(hotelId) {
    return http.get(`/review/hotel/${hotelId}`);
  }

  getByBookingId(userId) {
    return http.get(`/review/user/${userId}`);
  }

  delete(reviewId) {
    return http.delete(`/review/${reviewId}`);
  }
  
}

export default new ReviewDataService();
