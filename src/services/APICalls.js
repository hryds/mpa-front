import API from "./API";

export default{
    getUsers(){
        return API().get('/users')
    },
    getUser(id) {
        return API().get(`/users/${id}`);
      }
}


