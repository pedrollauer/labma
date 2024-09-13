// Import the necessary Firebase modules
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc } = require('firebase/firestore');
const firebaseConfig = require('../seguranca/fb_config')

initializeApp(firebaseConfig);
const db = getFirestore();

class Ensaios {
  constructor() {
    this.collectionRef = collection(db, "ensaios"); // Reference to the "ensaios" collection
  }

  // Create a new ensaio (Create)
  async addEnsaio(code, description) {
    const newEnsaio = { code, description };
    try {
      const docRef = await addDoc(this.collectionRef, newEnsaio);
      console.log(`Ensaio added with ID: ${docRef.id}`);
    } catch (e) {
      console.error("Error adding ensaio: ", e);
    }
  }

  // Read all ensaios (Read)
  async getEnsaios() {
    try {
      const querySnapshot = await getDocs(this.collectionRef);
      const ensaiosList = [];
      querySnapshot.forEach((doc) => {
        ensaiosList.push({ id: doc.id, ...doc.data() });
      });
      return ensaiosList;
    } catch (e) {
      console.error("Error retrieving ensaios: ", e);
      throw e;
    }
  }

  // Read a specific ensaio by ID (Read)
  async getEnsaioById(id) {
    try {
      const docRef = doc(this.collectionRef, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        console.log('No such document!');
        return null;
      }
    } catch (e) {
      console.error("Error retrieving ensaio: ", e);
      throw e;
    }
  }

  // Update a specific ensaio by ID (Update)
  async updateEnsaio(id, updates) {
    try {
      const docRef = doc(this.collectionRef, id);
      await updateDoc(docRef, updates);
      console.log(`Ensaio updated with ID: ${id}`);
    } catch (e) {
      console.error("Error updating ensaio: ", e);
      throw e;
    }
  }

  // Delete a specific ensaio by ID (Delete)
  async deleteEnsaio(id) {
    try {
      const docRef = doc(this.collectionRef, id);
      await deleteDoc(docRef);
      console.log(`Ensaio deleted with ID: ${id}`);
    } catch (e) {
      console.error("Error deleting ensaio: ", e);
      throw e;
    }
  }

  // Add multiple dummy ensaios (Optional)
  async addDummyData() {
    const dummyData = [
      { code: "MA", description: "Macrograph" },
      { code: "LM", description: "Light microscopy" },
      { code: "TT", description: "Tensile tests" },
      { code: "FT", description: "Fatigue" },
      { code: "CT", description: "Charpy test" }
    ];

    for (const ensaio of dummyData) {
      await this.addEnsaio(ensaio.code, ensaio.description);
    }
  }
}

module.exports = Ensaios