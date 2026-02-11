export default defineContentScript({
  matches: ["<all_urls>"],
  main() {
    import("~/contents/index")
  },
})
