## Puppeteer script to block all friends of someone on Steam

### Prerequires

You need to be connected to steam.

You need to add this options to Chrome : `--remote-debugging-port=9222 --remote-debugging-address=0.0.0.0`

You need to set an argument like this : `node index.js https://steamcommunity.com/profiles/XXXX/friends/`

The steam account needs to authorize to see his list of friends.

### How it works

If we don't have the file `./links.json` locally, we are looking to the link in parameter `https://steamcommunity.com/profiles/XXXX/friends/`.
And we store all friends in `./links.json`

Then for each profile, we go to the profile and execute the right http request to block the profile.
