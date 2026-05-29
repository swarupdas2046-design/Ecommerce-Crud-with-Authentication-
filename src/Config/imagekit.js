import imagekit from "imagekit";

// Imagekit Instance
const StorageInstance = new imagekit({
    publicKey: process.env.PUBLIC_KEY,
    privateKey: process.env.PRIVATE_KEY,
  urlEndpoint: process.env.URL_ENDPOINT,
});

//  function to Image Upload 
export const Upload_files = async (file, filename) => {
  const option = {
    file,
    fileName: filename,
  };
  return await StorageInstance.upload(option);
};


// function to Image Delete
export const Delete_file = async (fileId) => {
  try {
    return await StorageInstance.deleteFile(fileId);
  } catch (error) {
    console.error("ImageKit Delete Error:", error);
  }
};