export default {
  methods: {
    createToast(
      message = 'default message',
      title = 'default title',
      variant = 'danger',
      appendToast = false,
      toaster = 'b-toaster-top-right') {
      this.$bvToast.toast(message, {
        title,
        variant,
        solid: true,
        toaster: toaster,
        appendToast: appendToast
      })
    }
  }
}
