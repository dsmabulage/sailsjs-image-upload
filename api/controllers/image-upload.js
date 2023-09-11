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
          saveAs(file, cb) {
            let ext = file.filename.split('.').pop();
            cb(null, `${file.filename}_${Date.now()}.${ext}`);
          },

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
