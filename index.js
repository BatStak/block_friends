import fs from "fs";
import puppeteer from "puppeteer";

const browser = await puppeteer.connect({
    browserURL: "http://127.0.0.1:9222",
});

let links = [];
try {
    links = JSON.parse(fs.readFileSync("links.json"));
} catch (e) {
    console.log("No Steam accounts list yet");
}

const page = await browser.newPage();

// add script to block images and load pages faster
await page.setRequestInterception(true);
page.on("request", (request) => {
    if (request.resourceType() === "image") {
        request.abort();
    } else {
        request.continue();
    }
});

const parentLog = (...elements) => {
    elements.forEach((elt) => console.log(elt));
};
page.exposeFunction("parentLog", parentLog);

if (!links.length) {
    const friendsPage = process.argv[2];
    if (!friendsPage) {
        throw new Error(`No Steam profile in parameters, please see README.md`);
    }

    console.log(`We are looking the the friends of ${friendsPage}`);
    await page.goto(friendsPage);

    links = await page.evaluate(() =>
        Array.from(document.querySelectorAll(".selectable_overlay"), (a) => a.getAttribute("href"))
    );

    fs.writeFileSync("links.json", JSON.stringify(links));
} else {
    console.log("we got a links.json file, we continue the last treatment");
}

let index = 1;
const length = links.length;
console.log(`Starting to block players`);
while (links.length > 0) {
    const link = links[0];

    console.log(`--------------------------------------------------------------------------`);
    console.log(`link (${index}/${length}): ${link}`);

    await page.goto(link);

    await page.evaluate(async () => {
        parentLog(`blocking steamid ${g_rgProfileData["steamid"]}`);
        await fetch("https://steamcommunity.com/actions/BlockUserAjax", {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            },
            method: "POST",
            body: `sessionID=${g_sessionID}&steamid=${g_rgProfileData["steamid"]}&block=1`,
        })
            .then(async (res) => {
                if (res.status === 200) {
                    parentLog(`success`);
                } else {
                    parentLog(`error`, await res.json());
                }
            })
            .catch(() => {
                parentLog(`unexpected error`);
            });
    });

    index++;
    links.shift();
    fs.writeFileSync("links.json", JSON.stringify(links));
}

console.log(`we are done.`);
fs.unlinkSync("links.json");

process.exit();
