import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
    uploadBytes,
    listAll,
} from "firebase/storage";
let storage = null;

// Initialize Cloud Storage
export function initializeStorage(app) {
    // Get a reference to the storage service, which is used to create references in your storage bucket
    storage = getStorage(app);
};

export async function upload(file, dir) {
    // Create the file metadata
    const metadata = {
        contentType: 'image/jpeg',
    };
    // Upload file and metadata to the object 'images/mountains.jpg'
    const storageRef = ref(storage, `${dir}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);
    let uri=null;
    // return url or null after completion of the upload.
    return await uploadTask.then(
        async (snapshot) => {
            const url = await getDownloadURL(snapshot.ref);
            return url;
        },
        (error) => {
            console.log('upload -> Error in uploading');
            // console.log(error);
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
                case 'storage/object-not-found':
                    console.log("File doesn't exist");
                    // File doesn't exist
                    break;
                case 'storage/unauthorized':
                    console.log("User doesn't have permission to access the object");
                    // User doesn't have permission to access the object
                    break;
                case 'storage/canceled':
                    console.log("User canceled the upload");
                    // User canceled the upload
                    break;

                // ...
                case 'storage/unauthorized':
                    console.log("User is not authorized to perform the desired action, check your security rules to ensure they are correct");
                    break;

                case 'storage/unauthenticated':
                    console.log("User is unauthenticated, please authenticate and try again");
                    break;

                case 'storage/unknown':
                    console.log("Unknown error occurred, inspect the server response");
                    // Unknown error occurred, inspect the server response
                    break;
            }
            return "";
        }
    );
    
}

export function fetchImageList() {
    const storageRef = ref(storage, '/');
    // Find all the prefixes and items.
    listAll(storageRef)
        .then((res) => {
            res.prefixes.forEach((folderRef) => {
                console.log(folderRef.name);
            });
           
        }).catch((error) => {
            console.log('fetchImageList -> Error in fetching list');
            console.log(error);
            // Uh-oh, an error occurred!
        });
}

export function createRef(userId) {
    const storageRef = ref(storage, `${userId}/.keep`);
    const bytes = new Uint8Array([0x48]);
    uploadBytes(storageRef, bytes).then((snapshot) => {
        console.log('Uploaded an array!');
    });
}

export function fetchDirList(callback) {
    const storageRef = ref(storage, '/');
    // Find all the prefixes and items.
    let dirList = []
    listAll(storageRef)
        .then((res) => {
            res.prefixes.forEach((folderRef) => {
                dirList.push(folderRef.name);
            });
            callback(dirList);
        }).catch((error) => {
            console.log('fetchImageList -> Error in fetching list');
            console.log(error);
            // Uh-oh, an error occurred!
        });
}

