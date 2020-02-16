# Curate App

Web application

## Spec
* Prototype due: 21st Feburary.
* Pilot in spring (April)

1. Poster screen.

2. Select image, upload to our server and send it for analysis. Server saves the image (locally or to cloud storage), requests a matching collection image and also saves a record of the match to DB for future use

   - __!! Where can we access the image collection by API? Else obtain copies?__
   -> Idunn to find out

3. Response is a 'matching' image(s). Allow this to be re-done with the same user image, or a different image chosen instead.
When response is available - make a comparison: curate the uploaded image by associating it with one or more works from a real art collection

   * user image
   * collection image artwork
   * title of collection image artwork
   * 'share' with museum (later, facebook and instagram)
   * label/description of image artwork
   * (later) sound file / curator speaking
   * green box - where to find the art in museum
   * 'prov igjen' - try again


  ### Dimitrios' work - Image Recognition / Matching
	* Investigate / identify systems for obtaining AI/ML image matching from a supplied collection, given a user-supplied image
	* Outline the facilities of each system
	* Select a system to begin with
	* Develop a model / training procedure in code that automates the image recognition

4. 'Thankyou' for contribution

5. Generate PDF for each matching and download.

   - No need to retain user, but possibly set a cookie would be useful to allow returning to selections if using the same device


# Prototype B: Playlist
Immersive music + displays with authentic art


Four pages:  Poster screen, Queue, item detail, browse art to select

1. User views the following pages as designed by Idunn
   - Intro - static, but could also be a video
   - Playlist 'feed'
   - Collection / Exhibition selection
   - Item selection from collection

2. User can select 1 or 2 collection artworks for display -> it is added to bottom of playlist. Selection order is ignored
   - __!! possible to remove an item?__
3. Playlist is shared between all visitors
4. Playlist advance:
   Each item lasts 30 seconds
   Timer countdown only shown on top image. No time on rest of images
   Timer counts down, at end next image moves to top
5. Playlist item metadata:
   Show separate screen or flip card over
   Metadata comes from Idunn's Excel sheets


# Hosting Options

  __!! Investigate possible Norwegian hosting for Node server__

  * Restrict access to any museum items stored on cloud to only our server

  *	Render: https://render.com/  Render is straight forward and easy to set up, includes an SQL database. It does not include storage.

  * Netlify: We could also use Netlify https://www.netlify.com/ which is similarly good. Netlify is ‘serverless’ - meaning we approach the idea from a paradigm of contacting the image matching and storage and database without a server in-between. This is a new way of thinking, but in the view of time available it may not be the fastest way to produce, unless you are concerned about hosting costs.

  * Heroku: https://www.heroku.com/  This will run server, database and storage connection for us, is very familiar and deployment should be straight forward

Estimated hosting costs (minimum, pay more for performance):

   * Render:  Static hosting + Server service + Database service + Amazon S3:  $15USD / month (Amazon S3 free for first 12 months)

   * Netlify:  Free

   * Heroku:  ‘Hobby Dyno’ + Database + S3 Storage inlcuded:  $12USD / month

Despite the alternatives, for this project I recommend Heroku as the best choice for hosting. Of course we can move the project elsewhere later, if required.
