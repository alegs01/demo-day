import { createContext, useContext, useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  // Replace with your Firebase config
  apiKey: "AIzaSyDFLS4PjYXWltXYrB3FvP3sb28WgM2RQDo",
  authDomain: "asesorame-f796d.firebaseapp.com",
  projectId: "asesorame-f796d",
  storageBucket: "asesorame-f796d.firebasestorage.app",
  messagingSenderId: "295135987284",
  appId: "1:295135987284:web:e83204e046b0bab90c0fc1",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const registerAuth = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const idToken = await user.getIdToken();
      console.log(idToken);
      /* await axios.post('', data) */
      return user; // Puedes agregar más datos del usuario si lo necesitas
    } catch (error) {
      throw new Error("Error al autenticar con Google: " + error.message);
    }
  };

  const logout = async (navigate) => {
    try {
      await signOut(auth);
      navigate("/"); // Redirigir a la raíz después de cerrar sesión
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const value = {
    user,
    login,
    registerAuth,
    loginWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
