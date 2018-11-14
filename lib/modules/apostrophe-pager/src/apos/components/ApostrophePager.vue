<template slot="footer">
  <div class="apos-page">
    {{ currentPage.value }} - Pager - {{ totalPages }}
  </div>
</template>

<script>
export default {
  name: 'ApostrophePager',
  props: {
    totalPages: Number,
    currentPage: Number
  },
  computed: {
    options() {
      return window.apos.modules[this.moduleName];
    }
  },
  methods: {
    // Something relating to manipulating the selection no doubt
  }
};
</script>
