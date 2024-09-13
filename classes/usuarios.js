const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, where} = require('firebase/firestore');
const firebaseConfig = require('../seguranca/fb_config')

class Usuarios {
  constructor() {
    initializeApp(firebaseConfig);
    const db = getFirestore();
    this.collectionRef = collection(db, 'usuarios');
  }

  // Create a new user
  async createUser(user) {
    try {
      const docRef = await addDoc(this.collectionRef, user);
      console.log('Document written with ID: ', docRef.id);
      return docRef.id;
    } catch (e) {
      console.error('Error adding document: ', e);
      throw e;
    }
  }

  // Read all users
  async getUsers() {
    try {
      const querySnapshot = await getDocs(this.collectionRef);
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() });
      });
      return users;
    } catch (e) {
      console.error('Error getting documents: ', e);
      throw e;
    }
  }

  // Read a specific user by ID
  async getUserById(id) {
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

  // Update a user by ID
  async updateUser(user) {
    const { id, ...updates } = user;
    try {
      const docRef = doc(this.collectionRef, id);
      await updateDoc(docRef, updates);
      console.log('Document updated with ID: ', id);
    } catch (e) {
      console.error('Error updating document: ', e);
      throw e;
    }
  }

  // Delete a user by ID
  async deleteUser(id) {
    try {
      const docRef = doc(this.collectionRef, id);
      await deleteDoc(docRef);
      console.log('Document deleted with ID: ', id);
    } catch (e) {
      console.error('Error deleting document: ', e);
      throw e;
    }
  }

  async getUserByEmail(email) {
    try {
      const q = query(this.collectionRef, where("email", "==", email)); // Query for email field
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.log('No user found with that email!');
        return null;
      }

      // Assuming there is only one user with that email
      let user = null;
      querySnapshot.forEach((doc) => {
        user = { id: doc.id, ...doc.data() }; // Return the user's document data along with its ID
      });

      return user;
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  }
}

module.exports = Usuarios;
