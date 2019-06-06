<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <div class="text-xs-center">
        <logo />
        <vuetify-logo />
        <v-btn color="info" @click="generateCodeVerifierForPKCE"
          >Authorize</v-btn
        >
      </div>
      <v-card>
        <v-card-title class="headline"
          >Welcome to the Vuetify + Nuxt.js template</v-card-title
        >
        <v-card-text>
          <p>
            Vuetify is a progressive Material Design component framework for
            Vue.js. It was designed to empower developers to create amazing
            applications.
          </p>
          <p>
            For more information on Vuetify, check out the
            <a href="https://vuetifyjs.com" target="_blank">documentation</a>.
          </p>
          <p>
            If you have questions, please join the official
            <a href="https://chat.vuetifyjs.com/" target="_blank" title="chat"
              >discord</a
            >.
          </p>
          <p>
            Find a bug? Report it on the github
            <a
              href="https://github.com/vuetifyjs/vuetify/issues"
              target="_blank"
              title="contribute"
              >issue board</a
            >.
          </p>
          <p>
            Thank you for developing with Vuetify and I look forward to bringing
            more exciting features in the future.
          </p>
          <div class="text-xs-right">
            <em><small>&mdash; John Leider</small></em>
          </div>
          <hr class="my-3" />
          <a href="https://nuxtjs.org/" target="_blank">Nuxt Documentation</a>
          <br />
          <a href="https://github.com/nuxt/nuxt.js" target="_blank"
            >Nuxt GitHub</a
          >
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" flat nuxt to="/inspire">Continue</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import Logo from '~/components/Logo.vue'
import VuetifyLogo from '~/components/VuetifyLogo.vue'
import uuid from 'uuid'

const Cookie = process.client ? require('js-cookie') : undefined

export default {
  components: {
    Logo,
    VuetifyLogo
  },
  data() {
    return {
      // unreserverd chars described in RFC3986 Sec 2.3
      // https://tools.ietf.org/html/rfc3986#section-2.3
      unreserverdChars:
        '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz-._~'
    }
  },
  mounted() {
    // because it's in dev, secure attribute is set as false
    const state = uuid()
    Cookie.set('SessionID', state, {
      secure: process.env.NODE_ENV !== 'development'
    })
  },
  methods: {
    // https://tools.ietf.org/html/rfc7636
    generateCodeVerifierForPKCE() {
      // Generating code_verifier
      // https://tools.ietf.org/html/rfc7636#section-4.1
      let codeVerifier = ''

      const l = this.unreserverdChars.length
      // code verifier can be 48~128 char length
      for (let i = 0; i < 128; i++) {
        codeVerifier += this.unreserverdChars[Math.floor(Math.random() * l)]
      }
      this.$store.commit('oauth/setVerifier', codeVerifier)

      // Generate and Return Code Challenge
      // https://tools.ietf.org/html/rfc7636#section-4.2
      window.crypto.subtle
        .digest('SHA-256', new TextEncoder().encode(codeVerifier))
        .then(digestValue => {
          const codeChallenge = window
            .btoa(
              new Uint8Array(digestValue).reduce(
                (s, b) => s + String.fromCharCode(b),
                ''
              )
            )
            // base64 to base64url
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '')

          window.location.href =
            process.env.oktaAuthzEndpoint +
            '?client_id=' +
            process.env.oktaClientId +
            '&response_type=code&scope=openid offline_access' +
            '&redirect_uri=' +
            process.env.oktaAuthzRedirectURL +
            '&state=' +
            Cookie.get('SessionID') +
            '&code_challenge_method=' +
            'S256' + // For Now
            '&code_challenge=' +
            codeChallenge
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
