<template>
  <section>
    <div>Authorization Response</div>
    <div>error: {{ error }}</div>
    <div>code: {{ authzResponse.code }}</div>
    <div>state: {{ authzResponse.state }}</div>
  </section>
</template>

<script>
import axios from 'axios'

const Cookie = process.client ? require('js-cookie') : undefined

export default {
  data() {
    return {
      authzResponse: {},
      error: null
    }
  },
  mounted: function() {
    console.log('state issue')
    if (this.$route.query.state !== Cookie.get('SessionID')) {
      this.error = 'bad state'
    } else {
      this.authzResponse = this.$route.query
    }

    // ↓いらなくね？
    axios
      .get('http://localhost:3000/api/authorize/callback', {
        params: this.$route.query
      })
      .then(res => {
        console.log(res.data)
        // this.authz = res.data.authz.code
      })
      .catch(err => {
        console.log(err)
        this.error = err
      })
  }
}
</script>
