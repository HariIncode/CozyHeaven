import http from '../http-common';

class UserDataService{

    register(data){
        return http.post("/users", data);
    }

    update(data){
        return http.put("/users", data);
    }

    get(id){
        return http.get(`/users/${id}`);
    }

    findByEmail(email){
        return http.get("/users/find",{
            params: {
             email
           }
        });
    }

    getAll(){
        return http.get("/users");
    }

    delete(id){
        return http.delete(`/users/${id}`);
    }

}

export default new UserDataService();