# Heroku App
https://uia-kunst.herokuapp.com/

# Nasjonal Museet API

Call at this root:
https://ms01.nasjonalmuseet.no/media/dz/

Instructions for querying are here (with examples using a demo API key):
https://github.com/nasjonalmuseet/DiMu-API-documentation

And once we have a list, we can load individual images by referencing the 'defaultMediaIdentifier' described here:
https://github.com/nasjonalmuseet/DiMu-API-documentation/blob/master/retrieving-media.md

The response may contain thousands of images, so it's important to use the first query to narrow down the search.

# Database

This prototype used PostGres SQL, which also has a provision for Heroku
https://postgresapp.com/


