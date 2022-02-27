# uia
## Preparations for UIA workshop

## Build Setup

``` bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

## Deployment

You must have `gcloud` and a service accound credentials set up on local machine to allow the CLI to contact Google Cloud PLatform

app.yaml is used to mirror variables from .env file
However SIMILARITY_API should be set to the VM's internal IP.
GCP > VPC Network > Serverless VPC `uia-ml-connector` allows the App Engine to communicate with Compute Engine VM Instance
Connector must:
* Be created in the same region and project as the App Engine
* Be set to allow HTTP access (default-allow-http, firewall-80) in firewall rules
* Enable subnet that it is running in

`yarn run build` to create a fresh `build of the Nuxt code
`gcloud app deploy app.yaml --project organic-nation-267514` to push the build to Google App Engine

## Connecting to the ML Instance
`gcloud beta compute ssh --zone "europe-west3-b" "uia-ml-p3" --tunnel-through-iap --project "organic-nation-267514"`
Before this works, you may need to go to the GCP web console > Compute Engine > instance SSH dropdown and choose 'View gcloud command'
Once connected: `docker ps -a` and `docker attach --no-sdin` to follow activity

## Domain name

Access the site at `https://skmu-you.no`
