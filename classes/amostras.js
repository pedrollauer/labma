const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc } = require('firebase/firestore');
const firebaseConfig = require('../seguranca/fb_config')

class Amostras {
  constructor() {
    initializeApp(firebaseConfig);
    const db = getFirestore();
    this.collectionRef = collection(db, 'amostras');
  }

  // Create a new sample
  async createSample(sample) {
    try {
      const docRef = await addDoc(this.collectionRef, sample);
      console.log('Document written with ID: ', docRef.id);
      return docRef.id;
    } catch (e) {
      console.error('Error adding document: ', e);
      throw e;
    }
  }

  // Read all samples
  async getSamples() {
    try {
      const querySnapshot = await getDocs(this.collectionRef);
      const samples = [];
      querySnapshot.forEach((doc) => {
        samples.push({ id: doc.id, ...doc.data() });
      });
      return samples;
    } catch (e) {
      console.error('Error getting documents: ', e);
      throw e;
    }
  }

  // Read a specific sample by ID
  async getSampleById(id) {
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

  // Update a sample by ID
  async updateSample(sample) {
    const { id, ...updates } = sample;
    try {
      const docRef = doc(this.collectionRef, id);
      await updateDoc(docRef, updates);
      console.log('Document updated with ID: ', id);
    } catch (e) {
      console.error('Error updating document: ', e);
      throw e;
    }
  }

  // Delete a sample by ID
  async deleteSample(id) {
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


module.exports = Amostras;
