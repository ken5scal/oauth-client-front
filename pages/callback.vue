<template>
  <section>
    <div>Authorization Response</div>
    <div>error: {{ error }}</div>
    <div>code: {{ authzResponse.code }}</div>
    <div>state: {{ authzResponse.state }}</div>

    <div>Token Request</div>
    <div>error: {{ tokenResponseError }}</div>
    <div>
      access token (Not Supposed to receive, but for debug purpose):
      {{ tokenResponse.access_token }}
    </div>
    <div>token type: {{ tokenResponse.token_type }}</div>
    <div>expiry: {{ tokenResponse.expiry }}</div>
  </section>
</template>

<script>
import axios from 'axios'

const Cookie = process.client ? require('js-cookie') : undefined

export default {
  data() {
    return {
      authzResponse: {},
      tokenResponse: {},
      tokenResponseError: '',
      error: null
    }
  },
  mounted: function() {
    // Checking CSRF attack on the `code` during the Authorization Response
    if (this.$route.query.state !== Cookie.get('SessionID')) {
      this.$root.error({
        statusCode: 403,
        message: 'State is invalid. Suspected to be CSRFed.'
      })
    } else {
      this.authzResponse = this.$route.query
      axios
        .post(
          'http://localhost:9000/token',
          JSON.stringify({
            authz_code: this.$route.query.code,
            code_verifier: this.$store.getters['oauth/getVerifier']
          }),
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )
        .then(res => {
          this.tokenResponse = res.data
        })
        .catch(err => {
          this.tokenResponseError = err.response.data
        })
      this.$store.commit('oauth/removeVerifier')
    }
  }
}
</script>
