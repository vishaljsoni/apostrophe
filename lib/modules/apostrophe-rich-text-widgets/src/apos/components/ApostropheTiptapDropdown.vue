<template>
  <div>
    <button @click="manage()">
      {{ tool.label }}
    </button>
    <div v-if="seen">
      <button @click="click()" :class="{ 'apos-active': active() }" v-for="item in tool.options">
        {{ item.label }}
      </button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ApostropheTiptapDropdown',
  data () {
    return {
      seen: false
    }
  },
  props: {
    name: String,
    editor: Object,
    tool: Object
  },
  methods: {
    manage() {
      if (this.seen === false) {
        this.seen = true;
      } else {
        this.seen = false;
      }
    },
    command() {
      return this.tool.command || this.name;
    },
    click() {
      this.editor.commands[this.command()](this.tool.commandParameters || {});
    },
    active() {
      let activeTester = this.editor.isActive[this.command()];
      if (!activeTester) {
        return false;
      }
      activeTester.bind(this.editor);
      return activeTester(this.tool.commandParameters);
    }
  }
};
</script>

<style>
  .apos-active {
    background-color: blue;
  }
</style>
