export const validateNotNull = (value) => {
    if (!value) {
        return "Obrigatório";
    }

    return true;
};


export const validateEmail = (value) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!value) {
        return "Obrigatório.";
    }
    if (!emailRegex.test(value)) {
        return "E-mail inválido.";
    }
    return true;
};

export const validateCNPJ = (value) => {
    const cnpjRegex = /^[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}-?[0-9]{2}$/;
    if (!value) {
        return "Obrigatório.";
    }
    if (!cnpjRegex.test(value)) {
        return "CNPJ inválido.";
    }
    return true;
};

export const validateRGP = (value) => {
    const rgpRegex = /^([A-Za-z]{2})-?(\d{7})-?(\d)$/;
    if (!value) {
        return "Obrigatório.";
    }
    if (!rgpRegex.test(value)) {
        return "RGP inválido.";
    }
    return true;
};
