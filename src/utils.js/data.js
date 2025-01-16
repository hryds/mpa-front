import { ref } from "vue";

export const especies = ref([
    { nome: 'Thunnus thynnus (Albacora azul)' },
    { nome: 'Thunnus albacares (Albacora laje)' },
    { nome: 'Thunnus alalunga (Albacora branca)' },
    { nome: 'Thunnus obesus (Albacora bandolim)' },
    { nome: 'Bonito-listrado (SKJ)' },
    { nome: 'Thunnus atlanticus (Albacorinha)' },
    { nome: 'Katsuwonus pelamis (Bonito listrado)' },
    { nome: 'Sarda sarda (Sarda)' },
    { nome: 'Auxis thazard (Bonito cachorro)' },
    { nome: 'Acanthocybium solandri (Cavala empige)' },
    { nome: 'Scomberomorus cavalla (Cavala)' },
    { nome: 'Scomberomorus brasiliensis (Serra)' },
    { nome: 'Istiophorus albicans (Agulhão vela)' },
    { nome: 'Makaira nigricans (Agulhão negro)' },
    { nome: 'Kajikia albida (Agulhão branco)' },
    { nome: 'Xiphias gladius (Espadarte)' },
    { nome: 'Tetrapturus pfluegeri (Agulhão verde)' },
    { nome: 'Prionace glauca (Tubarão azul)' },
    { nome: 'Carcharhinus longimanus (Tubarão estrangeiro)' },
    { nome: 'Carcharhinus falciformis (Tubarão lombo-preto)' },
    { nome: 'Isurus oxyrinchus (Mako/ Anequim)' },
    { nome: 'Alopias superciliosus (Tubarão raposa)' },
    { nome: 'Coryphaena hippurus (Dourado)' }
]);

export const users = ref([
    {
        id: 1,
        email: 'empresa1@email.com',
        nome: 'Empresa 1',
        tipo: 'comum',
        stts: 'pendente',
        cnpj: '99.187.675/0601-43',
        rgp: 'AA12696890',
        endereco: 'Rua ABC Num. 1234',
    },
    {
        id: 2,
        email: 'empresa2@email.com',
        nome: 'Empresa 2',
        tipo: 'comum',
        stts: 'aprovado',
        cnpj: '98.187.675/0601-43',
        rgp: 'AB12696890',
        endereco: 'Rua ABC Num. 1234',
    },
]);