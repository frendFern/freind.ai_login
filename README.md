# frend_ai_2.0

To run, first 'npm install' for dependencies then 'npm start' to start the development server

Domain: timely.frend.ai

# Live streaming from browser to youtube:
1. Read https://github.com/dfrendai/timely-edition-ui/blob/main/backend/livestream-from-browser-to-yt/README.MD. Need to clone  https://github.com/piavgh/live-stream-socket-server locally and run server.js. (In the future we should move the server to somewhere in the cloud)
2. timely.frend.ai/authorize-yt-browser-streaming.html (assuming this is deployed to cloudflare already. Currently the latest version of timely is not deployed to cloudflare due to some neyra assests and model files being too large). Once on that page, click "Authorize" and you will be prompted to login to your youtube account
3. It will redirect you to timely.frend.ai/livestream-from-browser-to-yt.html. You can then enter stream title, stream description.
4. Click "Start streaming in 720p". Select a window to live stream, and youtube will automatically create a livestream for it.

# Deploying this repo to cloudflare
1. go to https://github.com/yangray1/timely-edition-ui . This is the current repo that's attached to cloudflare for deployment. (Only Anthony and Danny are admins of this repo currently)
2. Click "Sync fork" and click "Update branch". This will sync everything in this repo to https://github.com/yangray1/timely-edition-ui, and a new deployment of cloudflare will start ON BRANCH MAIN.
