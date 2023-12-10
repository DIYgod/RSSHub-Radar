export {}

console.log("HELLO WORLD FROM SANDBOXES")

window.addEventListener("message", (event) => {
  if (event.data?.name === "requestRSS") {
    event.source.postMessage({
      name: "responseRSS",
      url: event.data.url,
      result: ["1"],
    }, event.origin as any)
  }
})
