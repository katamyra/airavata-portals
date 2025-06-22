<template>
    <div class="generalcontainer">
        <div style="display: flex;">
            <input class="form-control" :id="id" :size="size" :disabled="disabled" :type="visibility" style="flex: 1;"
                   v-bind:value="value" v-on:input="$emit('input', $event.target.value)"/>
            <b-button variant="link" @click="showPassword()" v-if="visibility === 'password'">
                <b-icon icon="eye-slash-fill" aria-hidden="true"></b-icon>
            </b-button>

            <b-button variant="link" @click="hidePassword()" v-if="visibility === 'text'">
                <b-icon icon="eye" aria-hidden="true"></b-icon>
            </b-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Password",
        data() {
            return {
                visibility: 'password'
            }
        },
        props: {
            placeholder: {type: String, default: ''},
            id: {type: String, default: ''},
            value: null,
            size: {type: String, default: 'sm'},
            maxlength: {type: Number, default: 50},
            disabled: {type: Boolean, default: false}
        },
        methods: {
            showPassword() {
                this.visibility = 'text';
            },
            hidePassword() {
                this.visibility = 'password';
            }
        }
    }
</script>

<style scoped>
</style>
