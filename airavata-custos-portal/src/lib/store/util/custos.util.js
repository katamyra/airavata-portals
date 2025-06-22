import CustosService from "../../service/custos-service";
import config from "../../../config";

export const custosService = new CustosService({
    clientId: config.value('clientId'),
    baseURL: config.value('custosApiUrl')
});
