const { google } = require("googleapis");
const fs = require("fs");
const Client_id =
  "706645762043-6as1bcbbdticdes3lbl8mekjb8u3u4fc.apps.googleusercontent.com";
const Client_Secret = "s7Yq5ZTe-zSyOFerzg3oGWfp";
const Redirect_uri = "https://developers.google.com/oauthplayground";
const Refresh_token =
  "1//04FC6pW4ys5kHCgYIARAAGAQSNwF-L9IrGc7tL5MkRLQkMdCVAOgVDIWfF3a9gh9MkJFzG5aSsIq2s59riJ86OsZ_AW9rJVw6Shc";

const oauth2Client = new google.auth.OAuth2(
  Client_id,
  Client_Secret,
  Redirect_uri[0]
);
oauth2Client.setCredentials({ refresh_token: Refresh_token });

const drive = google.drive({
  version: "v3",
  auth: oauth2Client,
});

const google_upload = (originalName, destination, mimeType, id) => {
  const fileMetadata = {
    name: originalName,
    mimetype: mimeType,
    parents: id,
  };
  const media = {
    mimetype: mimeType,
    body: destination,
  };
  drive.files.create(
    {
      resource: fileMetadata,
      media: media,
      fields: "id",
    },
    (err, response) => {
      if (!err) {
        //  console.log(response);
      } else {
        console.log(err);
      }
    }
  );
};

const create_folder = (
  folder_name,
  mimeType,
  parents,
  originalname,
  destination,
  filemimetype
) => {
  const fileMetadata = {
    name: folder_name,
    mimeType: mimeType,
    parents: parents,
  };

  drive.files.create(
    {
      resource: fileMetadata,
      fields: "id",
    },
    (err, response) => {
      if (!err) {
        const id = response.data.id;
        google_upload(originalname, destination, filemimetype, [id]);
      } else {
        console.log(err);
      }
    }
  );
};

const multiplecreate_folder = (
  folder_name,
  mimeType,
  parents,
  resumeoriginalname,
  resumedestination,
  resumefilemimetype,
  coverletteroriginalname,
  coverletterdestination,
  coverletterfilemimetype
) => {
  const drive = google.drive({
    version: "v3",
    auth: oauth2Client,
  });
  const fileMetadata = {
    name: folder_name,
    mimeType: mimeType,
    parents: parents,
  };

  drive.files.create(
    {
      resource: fileMetadata,
      fields: "id",
    },
    (err, response) => {
      if (!err) {
        const id = response.data.id;
        google_upload(
          resumeoriginalname,
          resumedestination,
          resumefilemimetype,
          [id]
        );

        google_upload(
          coverletteroriginalname,
          coverletterdestination,
          coverletterfilemimetype,
          [id]
        );
      } else {
        console.log(err);
      }
    }
  );
};

module.exports = {
  create_folder,
  multiplecreate_folder,
};
