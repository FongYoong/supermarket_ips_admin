import { getDatabase, ref, push, get, set, update, onValue, remove, off,
  query, limitToFirst, orderByChild, equalTo
} from "firebase/database";
import axios from 'axios';
const database = getDatabase();

// Cloudinary

export const getCloudinarySignature = (handler) => {
    const credentials = {api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY, signature: '', timestamp: ''};
    axios.post('/api/get_cloudinary_signature', {}).then((response) => {
        credentials.signature = response.data.signature;
        credentials.timestamp = response.data.timestamp;
        handler(credentials);
    },
    (error) => {
        alert("Cloudinary Signature Error");
        console.log("Cloudinary Signature Error", error);
    });
}

export const uploadImages = (credentials, imageFiles, progressHandler, finishHandler) => {
    if (imageFiles.length > 0) {
      const instance = axios.create()
      const urls = [];
      const requests = imageFiles.map((image) => {
        if (typeof image.source === 'string') {
          console.log("image already uploaded before");
          urls.push(image.source); // url already exists, so no need to reupload
          return null;
        }
        else {
          const formData = new FormData();
          formData.append("api_key", credentials.api_key);
          formData.append("signature", credentials.signature);
          formData.append("timestamp", credentials.timestamp);
          formData.append("file", image.file);
          return instance.post(`http://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload`, formData, {
            headers:{'Content-Type':'multipart/form-data'},
            onUploadProgress: (progressEvent) => {
              const progressValue = Math.round(progressEvent.loaded / progressEvent.total * 100 / imageFiles.length);
              progressHandler(progressValue);
            }
          });
        }
      }).filter((v) => v!== null);
      axios.all(requests).then((responses) => {
        urls.push(...responses.map((r) => r.data.url));
        finishHandler(urls);
      }).catch(errors => {
        alert("Cloudinary Images Error");
        console.log("Cloudinary Images Error: ", errors);
      });
    }
    else {
      progressHandler(100);
      finishHandler(null);
    }
}

// Firebase

export const toArray = (snapshot) => {
  const array = [];
  snapshot.forEach((childSnapshot) => {
    array.push({
      id: childSnapshot.key,
      ...childSnapshot.val()
    })
  })
  return array;
}

export const getProductsRef = () => {
  let nodeRef = query(ref(database, '/products'));
  // let constraints = [];
  // if (category) {
  //   nodeRef = query(nodeRef, orderByChild('category'), equalTo(category));
  // }
  // if (sortType == 'alphabet') {
  //   nodeRef = query(nodeRef, orderByChild('name'), equalTo(sortDescending));
  // }
  // else if (sortType == 'dateModified') {

  // }
  return nodeRef;
}

// export const getProducts = async (watch, successHandler, errorHandler) => {
//     const targetRef = query(ref(database, `products/`), orderByChild('dateCreated'));
//     const success = (snapshot) => {
//         successHandler(snapshot.val())
//     };
//     const error = (error) => errorHandler(error);
//     if (watch) {
//         return onValue(targetRef, success, error);
//     }
//     else{
//         get(targetRef).then(success).catch(error);
//     }
// };

// export const detachProductListeners = async () => {
//     const targetRef = ref(database, `products/`);
//     off(targetRef);
// };
  
export const addProduct = async (data, successHandler, errorHandler) => {
    const currentTimeMillis = new Date().getTime();
    const newChildRef = push(ref(database, 'products/'));
    const productId = newChildRef.key;
    set(newChildRef, {
        ...data,
        dateCreated: currentTimeMillis,
        dateModified: currentTimeMillis
    }).then(() => successHandler(productId)).catch(errorHandler);
};

export const editProduct = async (productId, data, successHandler, errorHandler) => {
    const currentTimeMillis = new Date().getTime();
    const targetRef = ref(database, `products/${productId}`);
    update(targetRef, {
        ...data,
        dateModified: currentTimeMillis,
    }).then(successHandler).catch(errorHandler);
};
  
export const deleteProduct = async (productId, successHandler, errorHandler) => {
    const targetRef = ref(database, `products/${productId}`);
    remove(targetRef).then(successHandler).catch(errorHandler);
};