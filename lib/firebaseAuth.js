import { useState, useEffect, createContext, useContext } from 'react'
import { useRouter } from 'next/router'
import { SUCCESS_CODE } from './status_codes'
import { firebaseInstance } from "./firebase";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut as signOutFromFirebase } from "firebase/auth";
import { showNotification } from '@mantine/notifications';

const formatAuthUser = (user) => ({
    uid: user.uid,
    email: user.email
});
  
export default function useFirebaseAuth() {
    const router = useRouter();
    const auth = getAuth(firebaseInstance);
    const [authUser, setAuthUser] = useState(null);
    const [loading, setLoading] = useState(true);
  
    // listen for Firebase state change
    useEffect(() => {
      //const unsubscribe = Firebase.auth().onAuthStateChanged(authStateChanged);
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const formattedUser = formatAuthUser(user);
                setAuthUser(formattedUser);    
                setLoading(false);
            }
            else {
                setAuthUser(null)
                setLoading(false)
            }
        });
    }, []);

    const cleanup = () => {
      setAuthUser(null);
      setLoading(true);
      router.replace('/login');
      showNotification({
        title: 'See ya soon!',
        message: "You've signed out.",
        autoClose: 2500
      });
    };
  
    const signInWithEmail = (email, password, onSuccess, onFailure) => {
      const body = JSON.stringify({
        email
      })
      // Check if admin account first
      fetch('/api/verify_admin', {
          method: 'POST',
          body
      }).then((res) => {
          if (res.status == SUCCESS_CODE) {
            signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
              console.log("Successfully signed in with email and password");
              onSuccess();
              router.replace('/');
              showNotification({
                title: 'Welcome back!',
                message: "You've signed in.",
                autoClose: 2500
              });
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              if (errorCode == 'auth/wrong-password') {
                onFailure();
              }
              else {
                throw new Error(`Error code: ${error.code}\nError message: ${error.message}`)
              }
            });
          }
          else {
            throw new Error('Not admin account.')
          }
          //onSuccess("Added song");
      }).catch((error) => {
          console.log(error);
          console.log("Failed to sign in as admin.");
          onFailure();
      });
    };
    const signOut = () => signOutFromFirebase(auth).then(cleanup);
  
    return {
      auth,
      authUser,
      loading,
      signInWithEmail,
      signOut
    };
}

const authUserContext = createContext({
    auth: null,
    authUser: null,
    loading: true,
    signInWithEmailAndPassword: async () => {},
    signOut: async () => {}
  });
  
  export function AuthUserProvider({ children }) {
    const auth = useFirebaseAuth();
    return <authUserContext.Provider value={auth}>{children}</authUserContext.Provider>;
  }

  export const useAuth = () => useContext(authUserContext);