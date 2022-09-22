# FDP-Web-Archive


FDP-Web-Archive is a Chrome extension wich allows Fair Data Protocol users to create a pdf from any web page and to save it in their personal data store.

It was developed based on this requirements https://github.com/fairdatasociety/bounties/issues/8 for the [@FairDataSociety](https://github.com/fairDataSociety) bounty program on [Gitcoin](https://gitcoin.co).


## Screenshots

![Mask group-1](https://user-images.githubusercontent.com/94027312/191737639-046e88be-57ac-426f-8133-5ab6418a006e.png)
![Mask group](https://user-images.githubusercontent.com/94027312/191737651-42de99c6-fa32-47c0-b490-d26335368af3.png)


## Features

- [x] Save webpages as PDF.
- [x] View / Delete stored webpages.
- [x] Search by URL, title and content.
- [x] Share webpages with other people.
- [x] Import to your personal storage any webpage someone shared with you.

## Possible Future Features:

- [ ] UX/UI improvements.
- [ ] Prefetch.
- [ ] Download searchable content in the background.
- [ ] Optimistic updates.
- [ ] Pagination.
- [ ] Create Account.
- [ ] Forgot Password.
- [ ] Options / configuration page.



## Config

Update the env variables in the webpack.js file.
```
process.env.REACT_APP_BEE_BATCH_ID
process.env.REACT_APP_BEE_URL
process.env.REACT_APP_BEE_DEBUG_URL
process.env.REACT_APP_RPC_URL
process.env.REACT_APP_ENS_REGISTRY_ADDRESS
process.env.REACT_APP_PUBLIC_RESOLVER_ADDRESS
process.env.REACT_APP_SUBDOMAIN_REGISTRAR_ADDRESS
```
## Install

```
npm i
```

## Build

```
npm run build
```

## Build in watch mode

```
npm run watch
```

## Load extension to chrome

Load `dist` directory

## Test
`npx jest` or `npm run test`

