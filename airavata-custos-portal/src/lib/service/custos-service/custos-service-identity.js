import CustosService from "./index";

export default class CustosIdentity {
    /**
     * @type {CustosService}
     */
    _custosService = null;
    changeListeners = [];

    constructor(custosService) {
        this._custosService = custosService;

        window.addEventListener('storage', (e) => {
            for (let i = 0; i < this.changeListeners.length; i++) {
                this.changeListeners[i] && typeof this.changeListeners[i] === "function" && this.changeListeners[i](e);
            }
        });
    }

    get custosService() {
        return this._custosService;
    }

    onChange(changeListener) {
        this.changeListeners.push(changeListener);
    }

    getOpenIdConfig() {
        return this.custosService.axiosInstance.get(
            `${CustosService.ENDPOINTS.IDENTITY}/.well-known/openid-configuration`,
            {
                params: {'client_id': this.custosService.clientId}
            }
        );
    }

    async getToken({code}) {
        await this.custosService.axiosInstance.post(
            `${CustosService.ENDPOINTS.IDENTITY}/token`,
            {'code': code, 'grant_type': 'authorization_code'}
        );

        window.location.reload();
    }

    async localLogin({username, password}) {
        await this.custosService.axiosInstance.post(
            `${CustosService.ENDPOINTS.IDENTITY}/token`,
            {'grant_type': 'password', 'username': username, 'password': password}
        );

        window.location.reload();
    }

    async logout() {
        await this.custosService.axiosInstance.post(
            `${CustosService.ENDPOINTS.IDENTITY}/user/logout`,
            {refresh_token: this.refreshToken}
        );

        window.location.reload();
    }

    async getTokenUsingRefreshToken() {
        await this.custosService.axiosInstance.post(
            `${CustosService.ENDPOINTS.IDENTITY}/token`,
            {'refresh_token': this.custosService.identity.refreshToken, 'grant_type': 'refresh_token'}
        );
    }

    getClientSecret({clientId}) {
        return this.custosService.axiosInstance.get(
            `${CustosService.ENDPOINTS.IDENTITY}/credentials`,
            {
                params: {
                    "client_id": clientId
                }
            }
        ).then(({data: {custos_client_secret}}) => custos_client_secret);
    }

}
