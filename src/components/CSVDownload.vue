<template>
  <div class="csv-download">
    <button v-if="!postsData" @click="getPosts">Get Posts</button>
    <button v-if="postsData" @click="downloadCSV">Download as CSV</button>
    <button v-if="postsData" @click="clearData">Clear</button>
    <section v-if="error">
      <h1 class="error-title">Error:</h1>
      <pre class="error-message">{{ error || "An unidentified error has occurred" }}</pre> 
    </section>
    <section v-if="postsData">
      <h1>Posts Data:</h1>
      <pre>{{ postsData }}</pre> 
    </section>
  </div>
</template>

<script>
  import json2csv from 'json2csv';
  import { responseFormat } from 'utils';

  export default {
    name: 'CSVDownload',
    props: ['preload'],
    data() {
      return {
        postsData: null,
        error: null,
      };
    },

    methods: {
      batchRequest(nextPage) {
        fetch(nextPage)
          .then(response => response.json())
          .then((data) => {
            if (data.paging) {
              this.postsData.push(...responseFormat(data));
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
              this.postsData = responseFormat(data);
              this.batchRequest(data.paging.next);
            }
          });
      },

      downloadCSV() {
        const { postsData: data } = this;
        const filename = 'posts_list.csv';
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
