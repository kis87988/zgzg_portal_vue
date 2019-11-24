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
      &nbsp;
      <a
        href="https://accounts.google.com/signin/v2/recoveryidentifier?hd=zgzg.io"
        target="_blank"
      >
        <el-button
          type="primary"
          icon="fas fa-edit"
          v-if="!isSignIn"
          :disabled="!isInit"
        >Reset Password</el-button>
      </a>
      <el-button
        type="primary"
        icon="fas fa-edit"
        @click="handleClickSignOut"
        v-if="isSignIn"
        :disabled="!isInit"
      >sign out</el-button>
      <br />
      <br />
      <el-progress
        v-if="isSignIn && postReady!=true"
        v-loading.fullscreen.lock="postReady!=true"
        :percentage="99"
        :stroke-width="0"
        :show-text="false"
      ></el-progress>
      <el-form v-if="postReady">
        <el-form-item label="Sign in Email Address:" :disabled="true">
          <el-input v-model="profile.email" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="Sign up Email Address:">
          <el-input v-model="profile.data.EmailAddress" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="Chinese Name:">
          <el-input v-model="profile.data.ChineseName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="Prefer FirstName:">
          <el-input v-model="profile.data.FirstName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="Last Name:">
          <el-input v-model="profile.data.LastName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="Nick Name:">
          <el-input v-model="profile.data.NickName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="WechatID:">
          <el-input v-model="profile.data.WechatID" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="T-Shirt Size:">
          <el-input v-model="profile.data.TShirtSize" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="Dietary Restriction:">
          <el-input v-model="profile.data.DietaryRestriction" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="Zgid:">
          <el-input v-model="profile.data.Zgid" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="Zgid Email:">
          <el-input v-model="profile.data.ZgidEmail" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="Phone Number:">
          <el-input v-model="profile.data.PhoneNumber"></el-input>
        </el-form-item>
        <el-form-item label="Reimbursement Method:">
          <el-select v-model="profile.data.ReimbursementMethod">
            <el-option
              v-for="item in ReimbursementMethodOptions"
              :label="item"
              :key="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="profile.data.ReimbursementMethod != '我没有报销账户'"
          label="Reimbursement Account Type:"
        >
          <el-select
            v-model="profile.data.ReimbursementAccountType"
            value-key="profile.data.ReimbursementAccountType"
          >
            <el-option
              v-for="item in ReimbursementAccountTypeOptions"
              :label="item"
              :key="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="profile.data.ReimbursementAccountType == 'Email' &&profile.data.ReimbursementMethod != '我没有报销账户'"
          label="Reimbursement Account Email:"
        >
          <el-input v-model="profile.data.ReimbursementAccountEmail"></el-input>
        </el-form-item>
        <el-form-item
          v-if="profile.data.ReimbursementAccountType == 'Phone' && profile.data.ReimbursementMethod != '我没有报销账户'"
          label="Reimbursement Account Phone Number:"
        >
          <el-input v-model="profile.data.ReimbursementAccountPhoneNumber"></el-input>
        </el-form-item>
        <el-form-item label="2020 Zgla PromoCode:">
          <el-input v-model="profile.data.PromoCode2020" :disabled="true"></el-input>
        </el-form-item>
        <el-button
          type="primary"
          icon="fas fa-edit"
          @click="updateProfile"
          :disabled="!isInit"
        >update</el-button>
      </el-form>
    </el-row>
  </div>
</template>

<script>
/* eslint-disable */
import axios from "axios";
export default {
  name: "Portal",
  data() {
    return {
      errors: [],
      isInit: false,
      isSignIn: false,
      postReady: false,
      profile: {},
      ReimbursementMethodOptions: [
        "我没有报销账户",
        "Paypal"
      ],
      ReimbursementAccountTypeOptions: ["Email", "Phone"]
    };
  },
  methods: {
    validateEmail(email) {
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    },
    validatePhone(phone) {
      console.log(phone);
      let re = /^\d{10}$/;
      return re.test(String(phone).toLowerCase());
    },
    validateInfo() {
      if (
        !this.validatePhone(this.profile.data.PhoneNumber) ||
        (this.profile.data.ReimbursementAccountPhoneNumber != "" &&
          !this.validatePhone(
            this.profile.data.ReimbursementAccountPhoneNumber
          ))
      ) {
        this.$alert("phone number must be only 10 digits without any symbol");
        return false;
      }
      if (
        this.profile.data.ReimbursementAccountEmail != "" &&
        !this.validateEmail(this.profile.data.ReimbursementAccountEmail)
      ) {
        this.$alert("email format is not correct");
        return false;
      }
      return true;
    },
    async updateProfile() {
      if (this.validateInfo()) {
        this.postReady = false;
        if (this.profile.data.ReimbursementMethod == "我没有报销账户")
          this.profile.data.ReimbursementAccountType = "我没有报销账户";
        await axios
          .put(
            `http://${process.env.VUE_APP_API_HOST_IP}/api/UserAccessRecord/`,
            this.profile
          )
          .then(async response => {
            if (this.handleResponseStatus(response)) {
              this.profile.data = response.data;
              this.postReady = true;
            }
          })
          .catch(e => {
            this.handleResponseStatus(e.response);
            this.errors.push(e);
          });
      }
    },
    handleClickSignIn() {
      this.$gAuth
        .signIn()
        .then(GoogleUser => {
          this.isSignIn = this.$gAuth.isAuthorized;
          if (this.isSignIn) this.doSignInJob();
        })
        .catch(e => {
          this.handleResponseStatus(e.response);
          this.errors.push(e);
        });
    },
    async handleClickSignOut() {
      this.$gAuth
        .signOut()
        .then(() => {
          //on success do something
          this.isSignIn = this.$gAuth.isAuthorized;
          this.postReady = false;
          this.profile = {};
        })
        .catch(e => {
          this.handleResponseStatus(e.response);
          this.errors.push(e);
        });
    },
    async doSignInJob() {
      this.profile = {
        email: this.$gAuth.GoogleAuth.currentUser
          .get()
          .getBasicProfile()
          .getEmail(),
        access_token: this.$gAuth.GoogleAuth.currentUser.get().getAuthResponse()
          .access_token,
        first_issued_at: new Date(
          this.$gAuth.GoogleAuth.currentUser
            .get()
            .getAuthResponse().first_issued_at
        ),
        id_token: this.$gAuth.GoogleAuth.currentUser.get().getAuthResponse()
          .id_token,
        login_hint: this.$gAuth.GoogleAuth.currentUser.get().getAuthResponse()
          .login_hint,
        expires_at: new Date(
          this.$gAuth.GoogleAuth.currentUser.get().getAuthResponse().expires_at
        ),
        expires_in: this.$gAuth.GoogleAuth.currentUser.get().getAuthResponse()
          .expires_in,
        ip_address: this.client_ip,
        data: {}
      };
      await axios
        .post(
          `http://${process.env.VUE_APP_API_HOST_IP}/api/UserAccessRecord/`,
          this.profile
        )
        .then(async response => {
          if (this.handleResponseStatus(response)) {
            this.profile.data = response.data;
            this.postReady = true;
          }
        })
        .catch(e => {
          this.handleResponseStatus(e.response);
          this.errors.push(e);
        });
    },
    async handleResponseStatus(response) {
      let status = response.status;
      if (status == 201 || status == 200) return true;
      else if (status == 400) {
        this.$alert("bad request. Please contact info-center@zgzg.io");
      } else if (status == 401) {
        this.$alert("Unauthorized request");
        await this.handleClickSignOut();
      } else if (status == 404) {
        this.$alert("data not found. Please contact info-center@zgzg.io");
        await this.handleClickSignOut();
      }
      return false;
    }
  },
  async created() {
    let that = this;
    await axios.get(`http://www.geoplugin.net/json.gp`).then(async response => {
      this.client_ip = response.data.geoplugin_request;
    });

    let checkGauthLoad = setInterval(function() {
      that.isInit = that.$gAuth.isInit;
      that.isSignIn = that.$gAuth.isAuthorized;
      if (that.isInit) {
        if (that.isSignIn) that.doSignInJob();
        clearInterval(checkGauthLoad);
      }
    }, 1000);
  }
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
  color: #FFFFFF;
}
</style>
