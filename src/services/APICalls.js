import API from "./API";

export default {
    getUsers() {
        return API().get('/users')
    },
    getUser(id) {
        return API().get(`/users/${id}`);
    },
    updateUserNoPassword(id, updatedData) {
        return API().patch(`/users/${id}`, updatedData);
    },
    updateUserStatus(id, statusData) {
        return API().patch(`/users/updatestatus/${id}`, statusData);
    },
    updateUserType(id, typeData) {
        return API().patch(`/users/updatetype/${id}`, typeData);
    },
    updateUserPassword(id, passwordData) {
        return API().patch(`/users/updatepassword/${id}`, passwordData);
    },
    resetUserPassword(emailData) {
        return API().post(`/users/reset-password`, emailData);
    },
    createUser(formUserRegisterData) {
        return API().post('/users', formUserRegisterData);
    },
    deleteUser(id) {
        return API().delete(`/users/${id}`);
    },
    createProducao(formReportDateData) {
        return API().post('/producoes', formReportDateData);
    },
    getEmbarcacaobyRGP(rgp) {
        return API().get(`/embarcacoes/rgp/${rgp}`)
    },
    getEmbarcacao(id) {
        return API().get(`/embarcacoes/${id}`)
    },
    createEmbarcacao(formReportEmbarcacaoData) {
        return API().post('/embarcacoes', formReportEmbarcacaoData);
    },
    getEspecies() {
        return API().get('/especies');
    },
    createProducaoEmbarcacaoEspecie(formReportProducaoData) {
        return API().post('/producaoEmbarcacaoEspecies', formReportProducaoData);
    },
    getConsultas(id) {
        return API().get(`/consultas/${id}`);
    },
    auth(formLoginData) {
        return API().post('/auth', formLoginData);
    },
    logOut() {
        return API().get('/logout');
    },
    refreshToken() {
        return API().get('/refresh')
    },
    verifyID() {
        return API().get('/auth')
    },
    fileUpload(fileData) {
        return API().post('/upload', fileData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }
}

