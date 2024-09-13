const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc,  query, where  } = require('firebase/firestore');
const firebaseConfig = require('../seguranca/fb_config')

class Codigos {
  constructor() {
    initializeApp(firebaseConfig);
    const db = getFirestore();
    this.collectionRef = collection(db, 'codigos');
  }

  // Create a new code entry
  async createCodigo(codigo) {
    try {
      const docRef = await addDoc(this.collectionRef, codigo);
      console.log('Document written with ID: ', docRef.id);
      return docRef.id;
    } catch (e) {
      console.error('Error adding document: ', e);
      throw e;
    }
  }

  // Read all code entries
  async getCodigos() {
    try {
      const querySnapshot = await getDocs(this.collectionRef);
      const codigos = [];
      querySnapshot.forEach((doc) => {
        codigos.push({ id: doc.id, ...doc.data() });
      });
      return codigos;
    } catch (e) {
      console.error('Error getting documents: ', e);
      throw e;
    }
  }

  // Read a specific code entry by ID
  async getCodigoById(id) {
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

  // Read code entries by field "tabela"
  async getCodigosByTabela(tabela) {
    try {
      const q = query(this.collectionRef, where("tabela", "==", tabela));
      const querySnapshot = await getDocs(q);
      const codigos = [];
      querySnapshot.forEach((doc) => {
        codigos.push({ id: doc.id, ...doc.data() });
      });
      return codigos;
    } catch (e) {
      console.error('Error getting documents by tabela: ', e);
      throw e;
    }
  }

  // Update a code entry by ID
  async updateCodigo(codigo) {
    const { id, ...updates } = codigo;
    try {
      const docRef = doc(this.collectionRef, id);
      await updateDoc(docRef, updates);
      console.log('Document updated with ID: ', id);
    } catch (e) {
      console.error('Error updating document: ', e);
      throw e;
    }
  }

  // Delete a code entry by ID
  async deleteCodigo(id) {
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

module.exports = Codigos;
