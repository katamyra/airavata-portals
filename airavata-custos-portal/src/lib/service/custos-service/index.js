import axios from "axios";
import http from "http";
import https from "https";
import CustosGroups from "./custos-service-groups";
import CustosUsers from "./custos-service-users";
import CustosIdentity from "./custos-service-identity";
import CustosTenants from "./custos-service-tenants";
import CustosSharing from "./custos-service-sharing";
import CustosEntities from "./custos-service-entities";

const httpAgent = new http.Agent({keepAlive: true});
const httpsAgent = new https.Agent({keepAlive: true});

export default class CustosService {
    static ENDPOINTS = {
        IDENTITY: "/identity-management/v1.0.0",
        USERS: "user-management/v1.0.0",
        GROUPS: "group-management/v1.0.0",
        TENANTS: "tenant-management/v1.0.0",
        SHARING: "sharing-management/v1.0.0",
        SECRETS: "resource-secret-management/v1.0.0"
    };

    /**
     * Api Client ID
     * @type {strong}
     * @private
     */
    _clientId = null;

    /**
     * Api Client Secret
     * @type {strong}
     * @private
     */
    _clientSecret = null;

    /**
     * Api Base URL
     * @type {strong}
     * @private
     */
    _baseURL = null;


    /**
     * @type {CustosGroups}
     */
    _groups = null;


    /**
     * @type {CustosTenants}
     */
    _tenants = null;


    /**
     * @type {CustosUsers}
     */
    _users = null;

    /**
     * @type {CustosIdentity}
     */
    _identity = null;

    /**
     * @type {CustosSharing}
     */
    _sharing = null;

    /**
     * @type {CustosEntities}
     */
    _entities = null;

    constructor({clientId, baseURL}) {
        this._clientId = clientId;
        this._baseURL = baseURL;
        this._tenants = new CustosTenants(this);
        this._groups = new CustosGroups(this);
        this._users = new CustosUsers(this);
        this._identity = new CustosIdentity(this);
        this._sharing = new CustosSharing(this);
        this._entities = new CustosEntities(this);
    }

    get clientId() {
        return this._clientId;
    }

    get baseURL() {
        return this._baseURL;
    }

    get tenants() {
        return this._tenants;
    }

    get groups() {
        return this._groups;
    }

    get users() {
        return this._users;
    }

    get identity() {
        return this._identity;
    }

    get sharing() {
        return this._sharing;
    }

    get entities() {
        return this._entities;
    }

    get axiosInstance() {
        return axios.create({
            httpAgent,
            httpsAgent,
            baseURL: this.baseURL,
            withCredentials: false,
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json'
            }
        });
    }
}