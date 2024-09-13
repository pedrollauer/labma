// Import the necessary Firebase modules
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc } = require('firebase/firestore');

// Firebase configuration (replace with your own config)
const firebaseConfig = require('../seguranca/fb_config')


    initializeApp(firebaseConfig);
    const db = getFirestore();
class Projects {
  constructor() {
    this.collectionRef = collection(db, 'projetos');
  }

  // Create a new project
  async createProject(project) {
    try {
      // Add a new document with auto-generated ID
      const docRef = await addDoc(this.collectionRef, project);
      console.log('Document written with ID: ', docRef.id);
      return docRef.id;
    } catch (e) {
      console.error('Error adding document: ', e);
      throw e;
    }
  }

  // Read all projects
  async getProjects() {
    try {
      const querySnapshot = await getDocs(this.collectionRef);
      const projects = [];
      querySnapshot.forEach((doc) => {
        projects.push({ id: doc.id, ...doc.data() });
      });
      return projects;
    } catch (e) {
      console.error('Error getting documents: ', e);
      throw e;
    }
  }

  // Read a specific project by ID
  async getProjectById(id) {
    try {
      const docRef = doc(db, 'projetos', id);
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

  // Update a project by ID
  async updateProject(project) {
    const { id, ...updates } = project;
    try {
      const docRef = doc(db, 'projetos', id);
      await updateDoc(docRef, updates);
      console.log('Document updated with ID: ', id);
    } catch (e) {
      console.error('Error updating document: ', e);
      throw e;
    }
  }

  // Delete a project by ID
  async deleteProject(id) {
    try {
      const docRef = doc(db, 'projetos', id);
      await deleteDoc(docRef);
      console.log('Document deleted with ID: ', id);
    } catch (e) {
      console.error('Error deleting document: ', e);
      throw e;
    }
  }
}

module.exports = Projects;
