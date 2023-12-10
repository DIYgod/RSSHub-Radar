import { defaultConfig } from './config';
import { Storage } from "@plasmohq/storage"

const storage = new Storage({
    area: "local"
})

export function refreshRules() {
    return new Promise<void>((resolve) => {
        const done = async (response) => {
            const text = await response.text()
            await storage.set("rules", text)
            await storage.set("rulesDate", +new Date())
            resolve();
        };
        fetch(`https://rsshub.js.org/build/radar-rules.${defaultConfig.enableFullRemoteRules ? 'js' : 'json'}`)
            .then((response) => {
                done(response);
            })
            .catch(() => {
                fetch(`https://fastly.jsdelivr.net/gh/DIYgod/RSSHub@gh-pages/build/radar-rules.${defaultConfig.enableFullRemoteRules ? 'js' : 'json'}`).then((response) => {
                    done(response);
                });
            });
    });
}
