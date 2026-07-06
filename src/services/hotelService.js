import http from '../http-common';

class HotelDataService{

    addHotel(data){
        return http.post("/hotels", data);
    }

    updateHotel(hotelId ,data){
        return http.put(`/hotels/${hotelId}`, data);
    }

    getHotelById(hotelId){
        return http.get(`/hotels/${hotelId}`);
    }

    getAllHotels(){
        return http.get("/hotels");
    }

    getByOnwerId(ownerId){
        return http.get(`/hotels/owner/${ownerId}`);
    }

    getByLocation(data){
        return http.post("/hotels/search", data);
    }

    delete(hotelId){
        return http.delete(`/hotels/${hotelId}`);
    }

}

export default new HotelDataService();