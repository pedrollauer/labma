// Import the necessary Firebase modules
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc } = require('firebase/firestore');

// Firebase configuration (replace with your own config)
const firebaseConfig = require('../seguranca/fb_config')

    initializeApp(firebaseConfig);
    const db = getFirestore();
class Materiais {
  constructor() {

    this.collectionRef = collection(db, 'materiais');
  }

  // Create a new material
  async createMaterial(material) {
    try {
      const docRef = await addDoc(this.collectionRef, material);
      console.log('Document written with ID: ', docRef.id);
      return docRef.id;
    } catch (e) {
      console.error('Error adding document: ', e);
      throw e;
    }
  }

  // Read all materials
  async getMaterials() {
    try {
      const querySnapshot = await getDocs(this.collectionRef);
      const materials = [];
      querySnapshot.forEach((doc) => {
        materials.push({ id: doc.id, ...doc.data() });
      });
      return materials;
    } catch (e) {
      console.error('Error getting documents: ', e);
      throw e;
    }
  }

  // Read a specific material by ID
  async getMaterialById(id) {
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
      console.error('Error getting document: ', e);
      throw e;
    }
  }

  // Update a material by ID
  async updateMaterial(material) {
    const { id, ...updates } = material;
    try {
      const docRef = doc(this.collectionRef, id);
      await updateDoc(docRef, updates);
      console.log('Document updated with ID: ', id);
    } catch (e) {
      console.error('Error updating document: ', e);
      throw e;
    }
  }

  // Delete a material by ID
  async deleteMaterial(id) {
    try {
      const docRef = doc(this.collectionRef, id);
      await deleteDoc(docRef);
      console.log('Document deleted with ID: ', id);
    } catch (e) {
      console.error('Error deleting document: ', e);
      throw e;
    }
  }
}

module.exports = Materiais;

