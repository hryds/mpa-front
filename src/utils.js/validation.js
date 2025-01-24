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

export const validateCEP = (value) => {
    const cepRegex = /^\d{5}-?\d{3}$$/;
    if (!value) {
        return "Obrigatório.";
    }
    if (!cepRegex.test(value)) {
        return "CEP inválido.";
    }
    return true;
};

export const validatePeso = (value) => {
    const pesoRegex = /^\d+([.,]\d+)?$|null/;
    console.log(value)
    if (!pesoRegex.test(value)) {
        return "Formato Inválido";
    }
    return true;
    
};

