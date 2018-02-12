<template>
  <div class="csv-download">
    <button v-if="!postsData" @click="getPosts">Get Posts</button>
    <button v-if="!addressesData" @click="getAddresses">Get Addresses</button>
    <button v-if="postsData" @click="downloadCSV(postsData)">Download as CSV</button>
    <button v-if="addressesData" @click="downloadCSV(addressesData)">Download as CSV</button>
    <button v-if="postsData || addressesData" @click="clearData">Clear</button>
    <section v-if="error">
      <h1 class="error-title">Error:</h1>
      <pre class="error-message">{{ error || "An unidentified error has occurred" }}</pre>
    </section>
    <section v-if="postsData">
      <h1>Posts Data:</h1>
      <pre>{{ postsData }}</pre>
    </section>
    <section v-if="addressesData">
      <h1>Addresses Data:</h1>
      <pre>{{ addressesData }}</pre>
    </section>
  </div>
</template>

<script>
  import json2csv from 'json2csv';
  import { postsResponseFormat, addressesResponseFormat } from 'utils';

  export default {
    name: 'CSVDownload',
    props: ['preload'],
    data() {
      return {
        postsData: null,
        addressesData: null,
        error: null,
      };
    },

    methods: {
      batchRequest(nextPage, format) {
        fetch(nextPage)
          .then(response => response.json())
          .then((data) => {
            if (data.paging) {
              this.addressesData.push(...format(data));
              this.batchRequest(data.paging.next);
            } else {
              this.preload(false);
            }
          });
      },

      getPosts() {
        const myHeaders = new Headers();
        const myInit = {
          method: 'GET',
          headers: myHeaders,
          mode: 'cors',
          cache: 'default',
        };

        const endpoint = 'https://graph.facebook.com/v2.8/me/posts';
        const params = 'fields=created_time,message,comments.limit(1).summary(true),likes.limit(1).summary(true),shares&limit=100';
        const accesToken = `access_token=${FB.getAuthResponse().accessToken}`; // eslint-disable-line no-undef
        this.preload(true);

        fetch(`${endpoint}?${params}&${accesToken}`, myInit)
          .then(response => response.json())
          .then((data) => {
            if (data.paging) {
              this.postsData = postsResponseFormat(data);
              this.batchRequest(data.paging.next, postsResponseFormat);
            }
          });

        this.clearData();
      },

      getAddresses() {
        const myHeaders = new Headers();
        const myInit = {
          method: 'GET',
          headers: myHeaders,
          mode: 'cors',
          cache: 'default',
        };

        const endpoint = 'https://graph.facebook.com/v2.8/me/friends';
        const params = 'fields=hometown,first_name,last_name&limit=100';
        const accesToken = `access_token=${FB.getAuthResponse().accessToken}`; // eslint-disable-line no-undef
        this.preload(true);

        fetch(`${endpoint}?${params}&${accesToken}`, myInit)
          .then(response => response.json())
          .then((data) => {
            if (data.paging) {
              this.addressesData = addressesResponseFormat(data);
              if (data.paging.next) {
                this.batchRequest(data.paging.next, addressesResponseFormat);
              }
              this.preload(false);
            } else {
              this.preload(false);
            }
          });

        this.clearData();
      },

      downloadCSV(data) {
        const filename = 'list.csv';
        const link = document.createElement('a');
        let csv = json2csv({ data });

        if (csv == null) return;

        if (!csv.match(/^data:text\/csv/i)) {
          csv = `data:text/csv;charset=utf-8, ${csv}`;
        }

        link.setAttribute('href', encodeURI(csv));
        link.setAttribute('download', filename);
        link.click();
      },

      clearData() {
        this.postsData = null;
        this.addressesData = null;
      },
    },
  };
</script>

<style scoped>
  h1 {
    font-weight: 400;
  }

  pre {
    display: block;
    margin: 0 auto;
    text-align: left;
    overflow: auto;
    max-width: 40rem;
    background-color: ghostwhite;
    border: 1px solid silver;
    padding: 10px 20px;
  }

  h1.error-title {
    color: #cc0000;
  }

  pre.error-message {
    color: #fff;
    display: block;
    margin: 0 auto;
    text-align: left;
    overflow: auto;
    max-width: 40rem;
    background-color: #cc0000;
    border: 1px solid silver;
    padding: 10px 20px;
  }

  button {
    border: none;
    background: #4c69ba;
    background-image: -webkit-linear-gradient(top, #4c69ba, #3b55a0);
    background-image: -moz-linear-gradient(top, #4c69ba, #3b55a0);
    background-image: -ms-linear-gradient(top, #4c69ba, #3b55a0);
    background-image: -o-linear-gradient(top, #4c69ba, #3b55a0);
    background-image: linear-gradient(to bottom, #4c69ba, #3b55a0);
    -webkit-border-radius: 4;
    -moz-border-radius: 4;
    border-radius: 4px;
    font-family: Arial;
    color: #ffffff;
    font-size: 20px;
    padding: 10px 20px 10px 20px;
    text-decoration: none;
  }

  button:hover {
    cursor: pointer;
    background: #5b7bd5;
    background-image: -webkit-linear-gradient(top, #5b7bd5, #4864b1);
    background-image: -moz-linear-gradient(top, #5b7bd5, #4864b1);
    background-image: -ms-linear-gradient(top, #5b7bd5, #4864b1);
    background-image: -o-linear-gradient(top, #5b7bd5, #4864b1);
    background-image: linear-gradient(to bottom, #5b7bd5, #4864b1);
    text-decoration: none;
  }
</style>
