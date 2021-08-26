const { google } = require("googleapis");
const fs = require("fs");
const Client_id =
  "706645762043-6as1bcbbdticdes3lbl8mekjb8u3u4fc.apps.googleusercontent.com";
const Client_Secret = "s7Yq5ZTe-zSyOFerzg3oGWfp";
const Redirect_uri = "https://developers.google.com/oauthplayground";
const Refresh_token =
  "1//04iDxRgCeuQowCgYIARAAGAQSNwF-L9IrO9CC_Dnh7ud7OFHP7UruYxP4vs67j4dNZtbHBhJVngdbclFZKjpym8y8Pk1lg4DFMkQ";

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


const google_upload = (originalName, destination, mimeType,id) => {
  
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

        generatePublicUrl(response.data.id) 
      // console.log(response.data);

      
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
        name:folder_name,
        mimeType:mimeType,
        parents: parents,
      };


      drive.files.create(
            {
              resource: fileMetadata,
              fields: "id",
            },
            (err, response) => {
              if (!err) {
                
                const id=response.data.id;
                google_upload(
                  originalname , 
                    destination,
                    filemimetype,
                    [id]
                  ); 

                  
                
              } else {
                console.log(err);
              }
            }
          );
}



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
  
  const fileMetadata = {
        name:folder_name,
        mimeType:mimeType,
        parents: parents,
      };


      drive.files.create(
            {
              resource: fileMetadata,
              fields: "id",
            },
            (err, response) => {
              if (!err) {
                
                const id=response.data.id;
                google_upload(
                  
                  resumeoriginalname , 
                    resumedestination,
                    resumefilemimetype,
                    [id]
                  ); 
                  google_upload(
                  
                    coverletteroriginalname , 
                      coverletterdestination,
                      coverletterfilemimetype,
                      [id]
                    ); 
                
              } else {
                console.log(err);
              }
            }
          );
}


async function generatePublicUrl(id) {
  try {
     
      //change file permisions to public.
      await drive.permissions.create({
          fileId: id,
          requestBody: {
          role: 'reader',
          type: 'anyone',
         
          },
      });      
      //obtain the webview and webcontent links
      const result = await drive.files.get({
          fileId: id,
          fields: '*',
          
      });

      
    console.log(result.data);
  } catch (error) {
    console.log(error.message);
  }
}


  

module.exports={
  create_folder,multiplecreate_folder
}
