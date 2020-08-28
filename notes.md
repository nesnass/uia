## Deployment

You must have `gcloud` and a service accound credentials set up on local machine to allow the CLI to contact Google Cloud PLatform

app.yaml is used to mirror variables from .env file
However SIMILARITY_API should be set to the VM's internal IP.
GCP > VPC Network > Serverless VPC `uia-ml-connector` allows the App Engine to communicate with Compute Engine VM Instance

`yarn run build` to create a fresh `build of the Nuxt code
`gcloud app deploy app.yaml --project organic-nation-267514` to push the build to Google App Engine

## Connecting to the ML Instance
`gcloud beta compute ssh --zone "europe-west3-b" "uia-ml-p3" --tunnel-through-iap --project "organic-nation-267514"`
Before this works, you may need to go to the GCP web console > Compute Engine > instance SSH dropdown and choose 'View gcloud command'
Once connected: `docker ps -a` and `docker attach --no-sdin` to follow activity
