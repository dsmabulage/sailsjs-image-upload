
## Uploading Images to a Sails.js Server: A Quick Guide

Hi All,

![](https://cdn-images-1.medium.com/max/3840/1*l-UrKxnt-irZdlQVbdsTZg.png)

Greetings everyone! In this comprehensive guide, we will walk you through the process of uploading image files to a Sails.js server, deploying the application on Render.com, and accessing the uploaded images via the deployed URL. So, let’s dive right in!

## 1. Setup the Sailsjs server

### Install Sails

To kick things off, install Sails by running the following command:

    npm install sails g

### Create your app

Generate a new Sails app by navigating to your desired directory and executing:

    sails new test-project --no-frontend

For our purposes, we’re focusing solely on the server component.

### Configure Sailsjs routes

 1. Run this command in the CLI

    sails generate action image-upload

Run the following command in your CLI to create a controller file in the api/controllersfolder:

2. Within the image-uplod.js` file, add the following input configuration after the description:

```
     images: {
          type: 'ref',
          description: 'Uploaded file stream',
          required: true,
     },
```

3. After the description add this.

```
    files: ['images'],
```

Following this, add the ‘files’ property with ‘images’ as the value, indicating that this controller will handle image uploads.

4. Add this try-catch block inside fn to check the API is working.

```
     try {
          return exits.success("Success Response");
     } catch (error) {
          return exits.error(error);      
     }
```

5. Now the image-upload.js file will look like this.

```
    module.exports = {
      friendlyName: "Image upload",
    
      description: "",
    
      files: ["images"],
    
      inputs: {},
    
      exits: {},
    
      fn: async function (inputs, exits) {
        try {
          return exits.success("Success Response");
        } catch (error) {
          return exits.error(error);      
        }
      },
    };

```
6. Update the startscript in package.json to the following and then install cross-envusing npm i cross-env

    `"start": "cross-env NODE_ENV=production node app.js",`

7. Update the sockets inside of the config/env/production.js

```
     onlyAllowOrigins: [
          'http://localhost:3000'
     ],
```

8. Otherwise you can use sails lift it to up the server.

![server running](https://cdn-images-1.medium.com/max/2000/1*Xgt6tmMvRrluoP4KTTCYmg.png)

9. Setup the routes inside config/routes.js

setup the route as http://localhost:1337/api/v1/image-upload

    module.exports.routes = {
      'POST /api/v1/image-upload': 'image-upload'
    };

10. Re-run the server and make a POST API request to the http://localhost:1337/api/v1/image-upload endpoint using Postman.

![Success API response](https://cdn-images-1.medium.com/max/2000/1*qZX1JmVAPPYEJh4pWm8DYA.png)

### Configure Image Upload Code

Now our route is working perfectly.

1. Install the skipper npm npm i skipper and enable it inside the config/http.js . Add the maxTimeToBuffer image size limit settings to the bodyParserconfiguration, like this. max limit is restricted uploading files over 10 MB.

```
     bodyParser: (function _configureBodyParser(){
          var skipper = require('skipper');
          var middlewareFn = skipper({ strict: true, maxTimeToBuffer: 1000000 , limit: '10mb' });
          return middlewareFn;
        })(),
```

2. Navigate to image-upload.js and add the inputs section to specify image handling:

```
     inputs: {
        images: {
          type: 'ref',
          description: 'Uploaded file stream',
          required: true,
        },
      },
```
    

Replace the try-catch block within the fn function with code to handle image uploads:

```
      try {
    
           inputs.images.upload(
            {
              dirname: require('path').resolve(
                sails.config.appPath,
                'assets/images',
              ),
    
            },
            (err, uploadedFiles) => {
              if (err) {
                return this.res.serverError(err)
              };
    
              return exits.success({
                message: uploadedFiles.length + ' file(s) uploaded successfully!',
                files: uploadedFiles,
              });
            },
          );
    
    
        } catch (error) {
          return exits.error(error);      
        }
```

All the uploaded images will be saved in the assests/iamges folder.

Finally, image-upload.js the file looks like this.

```
    module.exports = {
      friendlyName: "Image upload",
    
      description: "",
    
      files: ["images"],
    
      inputs: {
        images: {
          type: 'ref',
          description: 'Uploaded file stream',
          required: true,
        },
      },
    
      exits: {},
    
      fn: async function (inputs, exits) {
        try {
    
           inputs.images.upload(
            {
              dirname: require('path').resolve(
                sails.config.appPath,
                'assets/images',
              ),
    
            },
            (err, uploadedFiles) => {
              if (err) {
                return this.res.serverError(err)
              };
    
              return exits.success({
                message: uploadedFiles.length + ' file(s) uploaded successfully!',
                files: uploadedFiles,
              });
            },
          );
    
    
        } catch (error) {
          return exits.error(error);      
        }
      },
    };
```

### Image upload to server

 1. Re-run the server and make a POST request with image form data using Postman.

![changing file type](https://cdn-images-1.medium.com/max/2000/1*glzqhD6Xtul5j0U3bql0ow.png)

Ensure you set the key type to filein the form data. You can select one or more images for upload.

![image upload API response](https://cdn-images-1.medium.com/max/2000/1*G6lGycffCc5a6RhY4S3S0w.png)

We will receive 200 responses and images will be uploaded inside the assest/images folder with unique names.

![uploaded images](https://cdn-images-1.medium.com/max/2000/1*-9AJJi2HSmIt6Q036PhXug.png)

2. To assign custom names to uploaded images, add the following code segment inside the upload method:

```
      saveAs(file, cb) {
        let ext = file.filename.split('.').pop();
        cb(null, `${file.filename}_${Date.now()}.${ext}`);
      },

    {
      dirname: require('path').resolve(
        sails.config.appPath,
        'assets/images',
      ),
      saveAs(file, cb) {
        let ext = file.filename.split('.').pop();
        cb(null, `${file.filename}_${Date.now()}.${ext}`);
      },
    },
```

This will result in images having custom names.

![images with custom name](https://cdn-images-1.medium.com/max/2000/1*P3QnAxWpFswwcLlWXjFJCA.png)

We have finished the image upload section.
>  Make sure to rerun the server everytime after changing the code, otherwise install nodemon npm i nodemon and run nodemon app.js nodemon will catch the code changes and automatically rerun the server.

### Access uploaded images via the URL

 1. Edit .sailsrc and add the public path:

     "paths": {
        "public": "assets"
      }

![.sailsrc file](https://cdn-images-1.medium.com/max/2000/1*zZqJAzno9ZEpxwgwL6sD9w.png)

2. Re-run the server and access the images via URLs like:

    http://localhost:1337/images/${image_name_with_extension}
    
    examples:- 
      http://localhost:1337/images/user.png_1694411326047.png
      http://localhost:1337/images/c91d3cf8-9018-4aa1-86f8-499b22e3ba84.png

![locally uploaded image](https://cdn-images-1.medium.com/max/3842/1*dZ1K6ErTcQNWXjpari1uWA.png)

## 2. Deploy the Web Application in Render

 1. Add assets/** to .gitignore folder.

 2. Update the package.json , add a new build script.

```
     "scripts": {
        "start": "cross-env NODE_ENV=production node app.js",
        "build": "npm install",
        "test": "npm run lint && npm run custom-tests && echo 'Done.'",
        "lint": "./node_modules/eslint/bin/eslint.js . --max-warnings=0 --report-unused-disable-directives && echo '✔  Your .js files look good.'",
        "custom-tests": "echo \"(No other custom tests yet.)\" && echo"
      },

```
3 . Initialize the git repository and push the code to git.

4. Create an account https://render.com and create a web service.

![create web service](https://cdn-images-1.medium.com/max/2000/1*wr06NslFXJCdZrcg1sbvbg.png)

5. Build and deploy from a Git repository.

6. Configure your account choose the correct GitHub repository and connect.

7. Configure the web app.

![Web app configuration 1](https://cdn-images-1.medium.com/max/3350/1*RyebLyxuq1VAOfbCL95UVg.png)

![Web app configuration 2](https://cdn-images-1.medium.com/max/3304/1*V90-MRH3WKG8zmBizycxHw.png)

8. Set up your web app configuration, choosing a free instance.

9. Create the web service, and you’ll see the deployment terminal in action

![web service terminal](https://cdn-images-1.medium.com/max/3306/1*NMc1txTYa8lHdq22q4lmeg.png)

10. Monitor the progress on the Render.com dashboard.

![the dashboard view](https://cdn-images-1.medium.com/max/2490/1*1BM2F1r29ll2OGhyLBNt3g.png)

10. Once the deployment is successful, you’re ready to proceed!

![Deployed Webapp](https://cdn-images-1.medium.com/max/2664/1*L6rI2Kzn10gaSsnBwkZTzA.png)

### Upload images to the deployed web app

 1. Copy the deployed web app URL.

![Webapp deployed URL](https://cdn-images-1.medium.com/max/2000/1*YQ9Ul5MIRm-BeM5FfzXDBw.png)

2. Replace the Postman localhost URL with this new URL and make a POST request to upload images.

![Success API response](https://cdn-images-1.medium.com/max/2000/1*6IEU4tk-aF10BqklOk226A.png)

You should receive a successful API response, indicating the images have been uploaded.

3. To view the uploaded images via the URL

* Retrieve the image names from the response files and append them to the server URL to access the images.

* URLs will resemble:

    https://sailsjs-image-upload.onrender.com/images/${image_name_with_extension}
    
    examples:- 
      https://sailsjs-image-upload.onrender.com/images/user.png_1694418912994.png
      https://sailsjs-image-upload.onrender.com/images/user.png_1694418912996.png

![View the deployed image via the URL](https://cdn-images-1.medium.com/max/2822/1*m1J3nthJUGejhQRLu9NMFA.png)

Congratulations! You’ve successfully set up image uploading in your Sails.js server, deployed the application on Render.com

![](https://cdn-images-1.medium.com/max/2000/0*ZpnyYxpATFEbXD2c.png)

## Thank You….

[Medium Link](https://medium.com/@dileepa.mabulage.edu/uploading-images-to-a-sails-js-server-a-quick-guide-a0a5089f8a2f)

You can find the code [Repository URL](https://github.com/dsmabulage/sailsjs-image-upload)

Want to see what I am working on? Check out my [GitHub](https://github.com/dsmabulage)

Want to connect? Reach out to me on [LinkedIn](https://www.linkedin.com/in/dileepa-mabulage-8334b3213/)


