function OffscreenPage() {
  console.log("HELLO WORLD FROM OFFSCREEN")

  return (
    <iframe id="sandbox" src="/sandboxes/index.html"></iframe>
  );
}

export default OffscreenPage;