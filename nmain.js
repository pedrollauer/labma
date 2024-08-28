const firebase = require("firebase/app")
const fire = require('firebase/firestore/lite')
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDmebVjB5Ke1Atr_wjPawC5hhZ8ixIxVBo",
  authDomain: "cliente-52567.firebaseapp.com",
  projectId: "cliente-52567",
  storageBucket: "cliente-52567.appspot.com",
  messagingSenderId: "1068658652797",
  appId: "1:1068658652797:web:1f54ae998a1b8178e0e314"
};

const app = firebase.initializeApp(firebaseConfig);
const db = fire.getFirestore(app);

// Get a list of cities from your database
async function listCards(db) {
  const cardsCol = fire.collection(db, 'cities');
  const cardsSnapshot = await fire.getDocs(cardsCol);
  // Map through each document and include the document ID in the data
  const cardsList = cardsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  return cardsList
}


  listCards(db).then((cards)=>{
    console.log(cards)
  })



  async function incrementAndGetFieldValue(docRef, fieldName) {
    try {
        const result = await db.runTransaction(async (transaction) => {
            const doc = await transaction.get(docRef);

            if (!doc.exists) {
                throw new Error("Document does not exist!");
            }

            const currentValue = doc.get(fieldName) || 0; // Get the current value of the field, default to 0 if it doesn't exist
            const newValue = currentValue + 1; // Increment the field by 1

            transaction.update(docRef, { [fieldName]: newValue }); // Update the field

            return newValue; // Return the updated value
        });

        console.log(`Updated value of ${fieldName}:`, result);
        return result;
    } catch (error) {
        console.error("Transaction failed:", error);
        throw error;
    }
}

// Usage example:
const docRef = db.collection('your_collection').doc('your_document_id');

incrementAndGetFieldValue(docRef, 'your_field_name')
    .then(updatedValue => {
        console.log('Final updated value:', updatedValue);
    })
    .catch(error => {
        console.error('Error updating value:', error);
    });
