function isSampled(rate) {
  const randomNumber = Math.floor(Math.random() * 100);
  return randomNumber < rate * 100;
}

function report({
  url = "https://radar.rsshub",
  name,
}: {
  url?: string
  name?: string
}) {
  if (
    process.env.PLASMO_PUBLIC_UMAMI_ID &&
    process.env.PLASMO_PUBLIC_UMAMI_URL &&
    (name || isSampled(parseFloat(process.env.PLASMO_PUBLIC_UMAMI_SAMPLE_RATE) || 0.01))
  ) {
    let hostname = ""
    try {
      hostname = new URL(url).hostname
    } catch (error) {}

    const umamiData = {
      payload: {
        hostname,
        language: chrome?.i18n?.getUILanguage(),
        referrer: hostname,
        url: hostname,
        website: process.env.PLASMO_PUBLIC_UMAMI_ID,
        name: name,
      },
      type: "event",
    }

    fetch(`${process.env.PLASMO_PUBLIC_UMAMI_URL}/api/send`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(umamiData),
      keepalive: true,
    })
  }
}

export default report
