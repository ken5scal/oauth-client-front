<template>
  <section>
    <div>Authorization Response</div>
    <div>cod: {{ authzResponse.code }}</div>
    <div>cod: {{ authzResponse.state }}</div>
  </section>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      authzResponse: {},
      error: null
    }
  },
  mounted: function() {
    this.authzResponse = this.$route.query
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
