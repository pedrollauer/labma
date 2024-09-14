const { getFirestore, doc, setDoc, getDoc, updateDoc, deleteDoc, collection, addDoc, getDocs } = require("firebase/firestore");
const Usuarios = require("./usuarios");

class Arquivos {
  constructor() {
    this.db = getFirestore(); // Initialize Firestore
    this.collectionRef = collection(this.db, 'arquivos'); // Reference to the 'arquivos' collection
  }

  // Create a new Arquivo
  async createArquivo(arquivo) {
    try {
      const docRef = await addDoc(this.collectionRef, arquivo);
      console.log('Arquivo created with ID:', docRef.id);
      return docRef.id;
    } catch (e) {
      console.error('Error creating Arquivo:', e);
      throw e;
    }
  }

  // Read a specific Arquivo by ID
  async getArquivoById(id) {
    try {
      const docRef = doc(this.collectionRef, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        console.log('No such Arquivo!');
        return null;
      }
    } catch (e) {
      console.error('Error getting Arquivo:', e);
      throw e;
    }
  }

  // Read all Arquivos
  async getAllArquivos() {
    try {
      const querySnapshot = await getDocs(this.collectionRef);
      const arquivos = [];
      querySnapshot.forEach((doc) => {
        arquivos.push({ id: doc.id, ...doc.data() });
      });
      return arquivos;
    } catch (e) {
      console.error('Error getting Arquivos:', e);
      throw e;
    }
  }

  // Update an Arquivo by ID
  async updateArquivo(id, updates) {
    try {
      const docRef = doc(this.collectionRef, id);
      await updateDoc(docRef, updates);
      console.log('Arquivo updated with ID:', id);
    } catch (e) {
      console.error('Error updating Arquivo:', e);
      throw e;
    }
  }

  // Delete an Arquivo by ID
  async deleteArquivo(id) {
    try {
      const docRef = doc(this.collectionRef, id);
      await deleteDoc(docRef);
      console.log('Arquivo deleted with ID:', id);
    } catch (e) {
      console.error('Error deleting Arquivo:', e);
      throw e;
    }

  }

  async getArquivosWithUserNames() {
    try {
      const arquivosSnapshot = await getDocs(collection(db, 'Arquivos'));
      const arquivosWithUserNames = [];
      const usuarios = new Usuarios()
  
      for (const arquivoDoc of arquivosSnapshot.docs) {
        const arquivoData = arquivoDoc.data();
        const userName = await usuarios.getUserById(arquivoData.usuario);  // Get user's name
        arquivosWithUserNames.push({
          ...arquivoData,
          usuario: userName,  // Replace usuario ID with name
        });
      }
      
      return arquivosWithUserNames;
    } catch (error) {
      console.error('Error getting arquivos:', error);
      return [];
    }
}
}

module.exports = Arquivos;
