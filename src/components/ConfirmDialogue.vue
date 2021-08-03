<template>
  <popup-modal ref="popup">
    <h4 style="margin-bottom: 2rem">{{ title }}</h4>
    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
      <button id="cancelBtn" class="btn btn-secondary" @click="_cancel">
        {{ cancelButton }}
      </button>
      <button id="confirmBtn" class="btn btn-danger" @click="_confirm">{{ okButton }}</button>
    </div>
  </popup-modal>
</template>

<script>
import PopupModal from "./PopupModal.vue";

export default {
  name: "ConfirmDialogue",

  components: { PopupModal },

  data: () => ({
    title: "Are you sure about that?",
    okButton: "Just do it!",
    cancelButton: "Nevermind..",
    resolvePromise: undefined,
    rejectPromise: undefined,
  }),

  methods: {
    show() {
      this.$refs.popup.open();
      return new Promise((resolve, reject) => {
        this.resolvePromise = resolve;
        this.rejectPromise = reject;
      });
    },

    _confirm() {
      this.$refs.popup.close();
      this.resolvePromise(true);
    },

    _cancel() {
      this.$refs.popup.close();
      this.resolvePromise(false);
    },
  },
};
</script>
