import API from "./API";

export default{
    getUsers(){
        return API().get('/users')
    },
    getUser(id) {
        return API().get(`/users/${id}`);
    },
    createUser(formUserRegisterData) {
        return API().post('/users', formUserRegisterData);
    },
    createProducao(formReportDateData){
        return API().post('/producoes', formReportDateData);
    },
    getEmbarcacaobyRGP(rgp){
        return API().get(`/embarcacoes/rgp/${rgp}`)
    },
    getEmbarcacao(id){
        return API().get(`/embarcacoes/${id}`)
    }
    
}


