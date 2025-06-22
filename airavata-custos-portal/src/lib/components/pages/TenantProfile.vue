<template>
  <TenantHome :title="title" :breadcrumb-links="breadcrumbLinks" :errors="errors">
    <template #header-right>
      <b-button variant="primary" v-on:click="onClickSave">Save Changes</b-button>
    </template>
    <b-overlay :show="processing">
      <div class="p-2 text-center">
        <div class="text-left" style="max-width: 600px; display: inline-block;">
          <!--          <div class="pt-3" style="display: flex; flex-direction: row;">-->

          <!--            <div style="flex: 1;" class="mr-2">-->
          <!--              <label class="form-label" for="username">Username</label>-->
          <!--              <b-form-input-->
          <!--                  v-model="username"-->
          <!--                  :state="inputState.username"-->
          <!--                  id="username"-->
          <!--                  trim-->
          <!--                  size="sm"-->
          <!--                  readonly>-->
          <!--              </b-form-input>-->
          <!--              <b-form-invalid-feedback>-->
          <!--                Enter at least 3 letters-->
          <!--              </b-form-invalid-feedback>-->
          <!--            </div>-->

          <!--            <div style="flex: 1;" class="mr-2">-->
          <!--              <label class="form-label" for="first-name">First Name</label>-->
          <!--              <b-form-input-->
          <!--                  v-model="firstName"-->
          <!--                  :state="inputState.firstName"-->
          <!--                  id="first-name"-->
          <!--                  trim-->
          <!--                  size="sm"-->
          <!--                  readonly>-->
          <!--              </b-form-input>-->
          <!--              <b-form-invalid-feedback>-->
          <!--              </b-form-invalid-feedback>-->
          <!--            </div>-->

          <!--            <div style="flex: 1;" class="ml-2">-->
          <!--              <label class="form-label" for="last-name">Last Name</label>-->
          <!--              <b-form-input-->
          <!--                  v-model="lastName"-->
          <!--                  :state="inputState.lastName"-->
          <!--                  id="last-name"-->
          <!--                  trim-->
          <!--                  size="sm"-->
          <!--                  readonly>-->
          <!--              </b-form-input>-->
          <!--              <b-form-invalid-feedback>-->
          <!--              </b-form-invalid-feedback>-->
          <!--            </div>-->
          <!--          </div>-->

          <!--          <div class="pt-3">-->
          <!--            <label class="form-label" for="email">Email</label>-->
          <!--            <b-form-input-->
          <!--                v-model="email"-->
          <!--                :state="inputState.email"-->
          <!--                type="email"-->
          <!--                id="email"-->
          <!--                trim-->
          <!--                size="sm"-->
          <!--                readonly>-->
          <!--            </b-form-input>-->
          <!--            <b-form-invalid-feedback>-->
          <!--            </b-form-invalid-feedback>-->
          <!--          </div>-->

          <div class="pt-3">
            <label class="form-label" for="tenantName">Tenant Name</label>
            <b-form-input
                v-model="tenantName"
                :state="inputState.tenantName"
                id="tenantName"
                trim
                size="sm"
                placeholder="Name of your OAuth 2.0 client"
                aria-describedby="tenantName-help-block">
            </b-form-input>
            <b-form-text id="tenantName-help-block">
              The Client Name is displayed to end-users on the Identity Provider selection page.
            </b-form-text>
            <b-form-invalid-feedback>
            </b-form-invalid-feedback>
          </div>

          <div class="pt-3">
            <label class="form-label" for="clientId">Client ID</label>
            <div style="display: flex; flex-direction: row;">
              <button-view style="flex: 1;">
                <template #content-when-hide>
                  <b-form-input
                      v-model="clientId"
                      type="password"
                      id="clientId"
                      size="sm"
                      readonly>
                  </b-form-input>
                </template>
                <template #content-when-view>
                  <b-form-input
                      v-model="clientId"
                      id="clientId"
                      size="sm"
                      readonly>
                  </b-form-input>
                </template>
              </button-view>
              <button-copy :value="clientId"/>
            </div>
          </div>

          <div class="pt-3">
            <label class="form-label" for="clientSecret">Secret</label>
            <div style="display: flex; flex-direction: row;">
              <button-view style="flex: 1;">
                <template #content-when-hide>
                  <b-form-input
                      v-model="clientSecret"
                      type="password"
                      id="clientId"
                      size="sm"
                      readonly>
                  </b-form-input>
                </template>
                <template #content-when-view>
                  <b-form-input
                      v-model="clientSecret"
                      id="clientId"
                      size="sm"
                      readonly>
                  </b-form-input>
                </template>
              </button-view>
              <button-copy :value="clientSecret"/>
            </div>
          </div>

          <div class="pt-3">
            <label class="form-label">Redirect URI</label>
            <div class="pb-2" v-for="(redirectUri, redirectUriIndex) in redirectUris" :key=redirectUriIndex>
              <label class="form-label" :for="`redirectUri-${redirectUriIndex}`"
                     style="visibility: hidden;line-height: 0px;margin: 0px;position: absolute;">
                Redirect URI {{ redirectUriIndex }}</label>
              <b-input-group>
                <b-form-input
                    v-model="redirectUris[redirectUriIndex]"
                    :state="inputState.redirectUris[redirectUriIndex]"
                    :id="`redirectUri-${redirectUriIndex}`"
                    trim
                    type="url"
                    size="sm">
                </b-form-input>
                <b-input-group-append>
                  <b-button size="sm" v-if="redirectUris.length > 1"
                            v-on:click="redirectUris = redirectUris.filter((r,i)=> i !== redirectUriIndex)">
                    Remove
                  </b-button>
                </b-input-group-append>
              </b-input-group>
              <b-form-invalid-feedback>
              </b-form-invalid-feedback>
            </div>
            <b-button size="sm" variant="link" v-on:click="redirectUris.push('')">Add another URI</b-button>
          </div>

          <div class="pt-3">
            <label class="form-label" for="scope">Scope</label>
            <b-form-checkbox-group
                v-model="scope"
                :options="['openid', 'email', 'profile', 'org.cilogon.userinfo']"
                :state="inputState.scope"
                id="scope"
                trim
                size="sm"
                aria-describedby="scope-help-block"
                :disabled="true">
            </b-form-checkbox-group>
            <b-form-text id="scope-help-block">
              <b-link href="https://www.cilogon.org/oidc#h.p_PEQXL8QUjsQm" target="_blank">Information on scopes
              </b-link>
            </b-form-text>
            <b-form-invalid-feedback>
            </b-form-invalid-feedback>
          </div>

          <div class="pt-3">
            <label class="form-label" for="domain">Domain</label>
            <b-form-input
                v-model="domain"
                :state="inputState.domain"
                id="domain"
                trim
                size="sm"
                placeholder="idp.htrc.indiana.edu">
            </b-form-input>
            <b-form-invalid-feedback>
            </b-form-invalid-feedback>
          </div>

          <div class="pt-3">
            <label class="form-label" for="clientUri">Client URI</label>
            <b-form-input
                v-model="clientUri"
                :state="inputState.clientUri"
                id="clientUri"
                trim
                size="sm">
            </b-form-input>
            <b-form-invalid-feedback>
            </b-form-invalid-feedback>
          </div>

          <div class="pt-3">
            <label class="form-label" for="logoUri">Logo URI</label>
            <b-form-input
                v-model="logoUri"
                :state="inputState.logoUri"
                id="logoUri"
                trim
                size="sm">
            </b-form-input>
            <b-form-invalid-feedback>
            </b-form-invalid-feedback>
          </div>

          <div class="pt-3">
            <label class="form-label" for="comment">Comment</label>
            <b-form-input
                v-model="comment"
                :state="inputState.comment"
                id="comment"
                trim
                size="sm"
                placeholder="Provide description of the new tenant and any other comments here (at least 15 characters long)">
            </b-form-input>
            <b-form-invalid-feedback>
            </b-form-invalid-feedback>
          </div>

          <div class="pt-3">
            <label class="form-label" for="applicationType">Application Type</label>
            <b-form-radio-group
                :options="['web']"
                v-model="applicationType"
                :state="inputState.applicationType"
                id="applicationType"
                trim
                size="sm">
            </b-form-radio-group>
            <b-form-invalid-feedback>
            </b-form-invalid-feedback>
          </div>

        </div>
      </div>
    </b-overlay>
  </TenantHome>
</template>

<script>
import store from "../../store";
import TenantHome from "./TenantHome";
import {custosService} from "../../store/util/custos.util";
import {
  VALIDATION_REGEX_DOMAIN,
  VALIDATION_REGEX_EMAIL,
  VALIDATION_REGEX_FIRST_NAME, VALIDATION_REGEX_LAST_NAME,
  VALIDATION_REGEX_URI
} from "../../../components/validation-regex";
import ButtonCopy from "../button/button-copy";
import ButtonView from "../button/button-view";

export default {
  name: "TenantProfile",
  store: store,
  components: {ButtonView, ButtonCopy, TenantHome},
  data() {
    return {
      processing: false,
      errors: [],

      username: null,
      firstName: null,
      lastName: null,
      email: null,

      tenantId: null,
      tenantName: null,
      redirectUris: [null],
      scope: [],
      domain: null,
      clientUri: null,
      logoUri: null,

      comment: null,
      applicationType: null,

      clientSecret: null,

      inputFieldsList: ["firstName", "lastName", "email", "tenantName", "redirectUris", "domain", "clientUri", "logoUri",
        "comment", "applicationType"]
    }
  },
  computed: {
    title: () => "Tenant Profile",
    breadcrumbLinks() {
      return [{to: `/tenants/${this.clientId}/profile`, name: this.title}];
    },
    clientId() {
      if (this.$route.params.clientId) {
        return this.$route.params.clientId;
      } else {
        return custosService.clientId;
      }
    },
    tenant() {
      return this.$store.getters["tenant/getTenant"]({clientId: this.clientId});
    },
    inputState() {
      return {
        username: this.username === null ? null : this.isValid.username,
        firstName: this.firstName === null ? null : this.isValid.firstName,
        lastName: this.lastName === null ? null : this.isValid.lastName,
        email: this.email === null ? null : this.isValid.email,

        tenantName: this.tenantName === null ? null : this.isValid.tenantName,
        redirectUris: this.redirectUris.map((redirectUri, redirectUriIndex) => {
          return this.redirectUris[redirectUriIndex] === null ? null : this.isValid.redirectUris[redirectUriIndex];
        }),
        scope: null,
        domain: this.domain === null ? null : this.isValid.domain,
        clientUri: this.clientUri === null ? null : this.isValid.clientUri,
        logoUri: this.logoUri === null ? null : this.isValid.logoUri,
        comment: this.comment === null ? null : this.isValid.comment,
        applicationType: this.applicationType === null ? null : this.isValid.applicationType
      }
    },
    isValid() {
      return {
        username: !!this.username && this.username.length >= 3,
        firstName: !!this.firstName && VALIDATION_REGEX_FIRST_NAME.test(this.firstName),
        lastName: !!this.lastName && VALIDATION_REGEX_LAST_NAME.test(this.lastName),
        email: !!this.email && VALIDATION_REGEX_EMAIL.test(this.email),

        tenantName: !!this.tenantName && this.tenantName.length > 0,
        redirectUris: this.redirectUris.map(redirectUri =>
            VALIDATION_REGEX_URI.test(redirectUri)),
        scope: true,
        domain: VALIDATION_REGEX_DOMAIN.test(this.domain),
        clientUri: VALIDATION_REGEX_URI.test(this.clientUri),
        logoUri: VALIDATION_REGEX_URI.test(this.logoUri),
        comment: true,
        applicationType: true
      }
    },
    isFormValid() {
      let _isFormValid = true;
      for (let i = 0; i < this.inputFieldsList.length; i++) {
        _isFormValid = _isFormValid && this.isValid[this.inputFieldsList[i]];
      }

      return _isFormValid;
    }
  },
  watch: {
    tenant() {
      this.username = this.tenant.username;
      this.firstName = this.tenant.firstName;
      this.lastName = this.tenant.lastName;
      this.email = this.tenant.email;

      this.tenantId = this.tenant.tenantId;
      this.tenantName = this.tenant.name;
      this.redirectUris = this.tenant.redirectUris;
      this.scope = this.tenant.scope ? this.tenant.scope.split(" ") : this.tenant.scope;
      this.domain = this.tenant.domain;
      this.clientUri = this.tenant.clientUri;
      this.logoUri = this.tenant.logoUri;

      this.comment = this.tenant.comment;
      this.applicationType = this.tenant.applicationType;

      this.clientSecret = this.tenant.clientSecret;
    }
  },
  methods: {
    makeFormVisited() {
      for (let i = 0; i < this.inputFieldsList.length; i++) {
        if (this[this.inputFieldsList[i]] === null) this[this.inputFieldsList[i]] = "";
      }
    },
    async onClickSave() {
      this.makeFormVisited();
      if (this.isFormValid) {
        this.processing = true;

        try {
          await this.$store.dispatch("tenant/updateTenant", {
            clientId: this.clientId,
            tenantId: this.tenantId,

            username: this.username,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,

            tenantName: this.tenantName,
            redirectUris: this.redirectUris,
            scope: this.scope,
            domain: this.domain,
            clientUri: this.clientUri,
            logoUri: this.logoUri,
            comment: this.comment,
            applicationType: this.applicationType,

            requesterEmail: this.tenant.requesterEmail
          });
        } catch (error) {
          this.errors.push({
            title: "Unknown error when updating the tenant.",
            source: error, variant: "danger"
          });
        }

        this.processing = false;
      }
    }
  },
  beforeMount() {
    this.$store.dispatch("tenant/fetchTenantSecret", {clientId: this.clientId});
  }
}
</script>

<style scoped>

</style>