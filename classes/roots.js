// Import the necessary Firebase modules
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc } = require('firebase/firestore');

// Firebase configuration (replace with your own config)
const firebaseConfig = require('../seguranca/fb_config')

class Roots {
  constructor() {
    initializeApp(firebaseConfig);
    const db = getFirestore();
    this.collectionRef = collection(db, 'roots');
  }

  // Create a new root
  async createRoot(root) {
    try {
      const docRef = await addDoc(this.collectionRef, root);
      console.log('Document written with ID: ', docRef.id);
      return docRef.id;
    } catch (e) {
      console.error('Error adding document: ', e);
      throw e;
    }
  }

  // Read all roots
  async getRoots() {
    try {
      const querySnapshot = await getDocs(this.collectionRef);
      const roots = [];
      querySnapshot.forEach((doc) => {
        roots.push({ id: doc.id, ...doc.data() });
      });
      return roots;
    } catch (e) {
      console.error('Error getting documents: ', e);
      throw e;
    }
  }

  // Read a specific root by ID
  async getRootById(id) {
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

  // Update a root by ID
  async updateRoot(root) {
    const { id, ...updates } = root;
    try {
      const docRef = doc(this.collectionRef, id);
      await updateDoc(docRef, updates);
      console.log('Document updated with ID: ', id);
    } catch (e) {
      console.error('Error updating document: ', e);
      throw e;
    }
  }

  // Delete a root by ID
  async deleteRoot(id) {
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

module.exports = Roots;
