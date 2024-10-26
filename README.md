## Puppeteer script to block all friends of someone on Steam

### Prerequires

You need to be connected to steam.

You need to add this options to Chrome : `--remote-debugging-port=9222 --remote-debugging-address=0.0.0.0`

You need to set an argument like this : `node index.js https://steamcommunity.com/profiles/XXXX/friends/`

The steam account needs to authorize to see his list of friends.
