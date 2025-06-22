<template>
  <b-container style="padding-top: 60px;">
    <b-row align-v="start" align-h="center">
      <b-col style="min-width: 300px; max-width: 600px;">
        <h2>Welcome to Custos</h2>
        <p class="h2-sub">Sign up and start authenticating</p>
        <!--        <div class="main-links">-->
        <!--          <b-link href="http://airavata.apache.org/custos/" target="_blank">Custos Website</b-link>-->
        <!--          <b-link class="ml-5"-->
        <!--                  href="https://cwiki.apache.org/confluence/display/CUSTOS/Gateways+2020%3ACustos+Tutorial"-->
        <!--                  target="_blank">-->
        <!--            Tutorial Instructions-->
        <!--          </b-link>-->
        <!--        </div>-->
        <img style="width: 70%;" src="../../../assets/custos_home.png">
      </b-col>
      <b-col style="max-width: 350px;min-width: 300px;" align-h="center">
        <div class="w-100">
          <div class="p-2 text-center">
            <h3>Login</h3>
            <!--            <div>-->
            <!--              New to Custos?-->
            <!--              <router-link to="/register">Sign Up</router-link>-->
            <!--            </div>-->

            <!--            <div class="mt-4">-->
            <!--              <label class="form-input-label" for="form-input-institution">Choose your Institution Identity</label>-->
            <!--              <b-select id="form-input-institution" size="sm" v-model="ciLogonInstitutionEntityId">-->
            <!--                <b-select-option v-for="ciLogonInstitution in ciLogonInstitutions" :key="ciLogonInstitution.entityId"-->
            <!--                                 :value="ciLogonInstitution.entityId">-->
            <!--                  {{ ciLogonInstitution.displayName }}-->
            <!--                </b-select-option>-->
            <!--              </b-select>-->
            <!--            </div>-->
            <!--            <div>-->
            <!--              HTRC uses CILogon to enable you to log in with your institutional credentials. By clicking Continue, you-->
            <!--              agree to the CILogon privacy policy you agree to share your institutional username, email address, and-->
            <!--              affiliation with CILogon.-->
            <!--            </div>-->
            <b-button variant="primary" class="mt-3" v-on:click="this.loadAuthURL">Institution Login</b-button>
          </div>
        </div>
        <div style="display: flex; flex-direction: row;" class="mt-3 mb-3">
          <hr style="flex: 1;background-color: #203A43;"/>
          <div style="padding: 5px 10px;">OR</div>
          <hr style="flex: 1;background-color: #203A43;"/>
        </div>
        <div class="w-100 mt-3">
          <form v-on:submit.prevent="login" class="p-2">
            <div class="mb-2">
              <label class="form-input-label" for="form-input-username">Username</label>
              <b-form-input id="form-input-username" v-model="username" size="sm" placeholder="Username"></b-form-input>
            </div>
            <div class="mb-2">
              <label class="form-input-label" for="form-input-password">Password</label>
              <b-form-input id="form-input-password" type="password" v-model="password" size="sm"
                            placeholder="Password"></b-form-input>
            </div>
            <b-button type="submit" variant="secondary" class="mt-3" v-on:click="this.login"
                      :disabled="this.loginDisabled">
              Login
              <b-spinner small v-if="this.loginDisabled"></b-spinner>
            </b-button>
            <div v-if="this.loginError" class="text-danger w-100 mt-4 text-left form-error-message">
              Invalid Username or Password
            </div>
            <!--            <p class="mt-3 w-100 additional-links text-center">-->
            <!--              Don't have an account?-->
            <!--              <router-link to="/register">Create an account</router-link>-->
            <!--            </p>-->
          </form>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import store from "../../store";

export default {
  name: 'LoginPage',
  store: store,
  props: {
    msg: String,
    seen: Boolean,
    todos: Array,
    successRedirect: String
  },
  data: function () {
    return {
      ciLogonInstitutionEntityId: null,
      username: "",
      password: "",
      loginDisabled: false,
      loginError: false
    }
  },
  computed: {
    authenticated: () => store.getters["auth/authenticated"],
    ciLogonInstitutions: () => store.getters["ciLogon/getInstitutions"]()
  },
  methods: {
    async login() {
      this.loginDisabled = true
      if (this.username != null && this.username != '' && this.password != null && this.password != '') {
        try {
          await this.$store.dispatch("auth/authenticateLocally", {
            username: this.username,
            password: this.password
          });
        } catch (error) {
          this.loginError = true;
        }
      } else {
        this.loginError = true
      }
      this.loginDisabled = false
    },
    async callDismissed() {
      this.loginError = false
    },
    loadAuthURL() {
      store.dispatch("auth/fetchAuthorizationEndpoint");
    },
    redirectIfAuthenticated() {
      if (this.authenticated === true) {
        this.$router.push('/tenants/default');
      }
    }
  },
  watch: {
    authenticated() {
      this.redirectIfAuthenticated();
    }
  },
  mounted() {
    this.redirectIfAuthenticated();
    store.dispatch("ciLogon/fetchInstitutions")
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


h2 {
  /*font-family: Avenir;*/
  font-size: 35px;
  font-weight: 900;
  color: #203a43;
  text-align: left;
}

.h2-sub {
  /*font-family: Avenir-Roman;*/
  font-size: 22px;
  color: #203a43;
  text-align: left;
}

h3 {
  /*font-family: Avenir;*/
  font-size: 25px;
  font-weight: 700;
  color: #203a43;
  text-align: left;
}

/*.h3-sub {*/
/*  font-family: Avenir-Roman;*/
/*  font-size: 20px;*/
/*  text-align: left;*/
/*  color: #203a43;*/
/*}*/

.form-input-label {
  font-weight: 700;
  text-align: left;
  float: left;
  color: #203a43;
}


.form-error-message {
  font-size: 14px;
  font-weight: 900;
  text-align: left;
}

/*.login-card {*/
/*  box-shadow: -1px 1px 6px 2px #ebebeb;*/
/*  border-radius: 10px;*/
/*  border: none;*/
/*}*/

/*.login-card .form-input-label {*/
/*  font-weight: 500;*/
/*  font-size: 15px;*/
/*}*/

.main-links a {
  font-family: Avenir;
  font-size: 20px;
  font-weight: 600;
  color: #ea6a0a;
}

.additional-links {
  font-size: 13px;
}

.additional-links a {
  color: #ea6a0a;
}
</style>
