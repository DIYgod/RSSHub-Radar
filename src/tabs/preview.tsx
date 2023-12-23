import { useEffect, useState } from "react";
import Parser from "rss-parser";
import "~/lib/style.css";
import RSSHubIcon from "data-base64:~/assets/icon.png"
import xss from "xss";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/lib/components/Card"
import RSSItem from "~/popup/RSSItem";

const parser = new Parser();

function PreviewPage() {
  const url = new URLSearchParams(window.location.search).get("url");

  const [parsed, setParsed] = useState<Parser.Output<{
      [key: string]: any;
  }> | undefined>();
  const [error, setError] = useState<Event>();

  useEffect(() => {
    fetch(url, {
      mode: "no-cors",
    }).then(res => {
      res.text().then(text => {
        parser.parseString(text).then(result => {
          setParsed(result);
        }).catch((e) => {
          setError(e)
        })
      }).catch((e) => {
        setError(e)
      })
    }).catch((e) => {
      setError(e)
    })
  }, [])
  console.log("error", error)

  return (
    <div className="max-w-screen-lg mx-auto py-16 text-base space-y-8">
      <div className="flex">
        {parsed?.image?.url && (
          <div className="w-24 h-24 overflow-hidden rounded-xl mr-8 object-cover">
            <img className="object-cover" src={parsed?.image?.url || RSSHubIcon} />
          </div>
        )}
        <div className="space-y-2 flex-1">
          <h1 className="text-3xl font-bold text-primary">{parsed?.title}</h1>
          <div className="text-zinc-600">{parsed?.description}</div>
          <div className="text-zinc-600">
            <a className="underline" href={parsed?.link}>{parsed?.link}</a>
          </div>
        </div>
      </div>
      <div className="w-fit flex items-center justify-center">
        <RSSItem item={{
          title: "",
          url,
          image: RSSHubIcon,
        }} type="currentPageRSS" hidePreview={true} />
      </div>
      <div className="space-y-8">
        {parsed?.items?.map((item, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle><a href={item.link}>{item.title}</a></CardTitle>
              <CardDescription>{item.pubDate}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-zinc-600 text-sm max-h-96 overflow-y-auto [&_img]:max-h-60 [&_img]:m-auto [&_p]:my-2" dangerouslySetInnerHTML={{
                __html: xss(item["content:encoded"] || item["content"])
              }}></div>
            </CardContent>
            <CardFooter>
              <div className="text-zinc-400">
                Source: <a className="underline break-all" href={item.link}>{item.link}</a>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      {error && (
        <div className="text-red-600">
          Error: {error.toString()}
        </div>
      )}
      {!parsed && (
        <div className="text-zinc-400">
          Loading...
        </div>
      )}
    </div>
  );
}

export default PreviewPage;
