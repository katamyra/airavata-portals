import Vue from 'vue';
import Vuex from 'vuex';
import {createCustosStore} from "./util";

const custorStore = createCustosStore(Vuex, Vue);

export default custorStore;
