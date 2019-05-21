<template>
  <section>
    <div>authz code: {{ authz }}</div>
  </section>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      authz: {},
      code: 'hogefuga',
      error: null
    }
  },
  mounted: function() {
    this.code = 'hoge'
    axios
      .get('http://localhost:3000/api/authorize/callback', {
        params: this.$route.query
      })
      .then(res => {
        console.log(res.data)
        this.authz = res.data.authz.code
      })
      .catch(err => {
        console.log(err)
        this.error = err
      })
  }
}
</script>
