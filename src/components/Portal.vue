<template>
  <div class="hello">
    <el-row>
      <el-button
        type="primary"
        icon="fas fa-edit"
        @click="handleClickSignIn"
        v-if="!isSignIn"
        :disabled="!isInit"
      >sign in</el-button>
      <el-button
        type="primary"
        icon="fas fa-edit"
        @click="handleClickSignOut"
        v-if="isSignIn"
        :disabled="!isInit"
      >sign out</el-button>
      <el-input placeholder="Please input" v-if="isSignIn" v-model="profile.email"></el-input>
      <i class="fas fa-edit"></i>
    </el-row>
  </div>
</template>

<script>
import axios from 'axios'
/* eslint-disable */
export default {
  name: "Portal",
  // props: {
  //   msg: String
  // },
  data() {
    return {
      isInit: false,
      isSignIn: false,
      profile:{},
    }
  },
  methods: 
  {
    handleClickSignIn() 
    {
      this.$gAuth
        .signIn()
        .then(GoogleUser => 
        {
          this.isSignIn = this.$gAuth.isAuthorized
          if(this.isSignIn) this.doSignInJob()
        })
        .catch(error => 
        {
          //on fail do something
        });
    },

    handleClickSignOut() 
    {
      this.$gAuth
        .signOut()
        .then(() => {
          //on success do something
          this.isSignIn = this.$gAuth.isAuthorized
          this.profile={}
        })
        .catch(error => {
          //on fail do something
        });
    },
    doSignInJob()
    {
      this.profile=
      {
        email:this.$gAuth.GoogleAuth.currentUser.get().getBasicProfile().getEmail(),
        access_token:this.$gAuth.GoogleAuth.currentUser.get().getAuthResponse().access_token,
        first_issued_at: new Date(this.$gAuth.GoogleAuth.currentUser.get().getAuthResponse().first_issued_at),
        id_token:this.$gAuth.GoogleAuth.currentUser.get().getAuthResponse().id_token,
        login_hint:this.$gAuth.GoogleAuth.currentUser.get().getAuthResponse().login_hint,
        expires_at:new Date(this.$gAuth.GoogleAuth.currentUser.get().getAuthResponse().expires_at),
        expires_in:this.$gAuth.GoogleAuth.currentUser.get().getAuthResponse().expires_in,
        ip_address: "1.1.1.1",
        action: "view",
      }
      axios.post(`http://127.0.0.1:8000/api/UserAccessRecord/`, this.profile)
      .then(response => {
        console.log(response)
      })
      .catch(e => {
        this.errors.push(e)
      })
    }
  },
  created() 
  {
    let that = this;
    let checkGauthLoad = setInterval(function() {
      that.isInit = that.$gAuth.isInit
      that.isSignIn = that.$gAuth.isAuthorized
      if (that.isInit)
      {
        if(that.isSignIn) that.doSignInJob()
        clearInterval(checkGauthLoad)
      }
    }, 1000)
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
