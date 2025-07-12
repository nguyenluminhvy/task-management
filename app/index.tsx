import {Button, Text, TextInput, View} from "react-native";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from "@firebase/auth";
import {collection, getDocs, getFirestore} from "@firebase/firestore";
import app from "@/app/config/firebaseConfig";
import {useEffect, useState} from "react";


const auth = getAuth(app);
const db = getFirestore(app);

async function getCities(db) {
  const citiesCol = collection(db, 'cities');
  const citySnapshot = await getDocs(citiesCol);
  const cityList = citySnapshot.docs.map(doc => doc.data());

  return cityList;
}


// await getCities(db)

export default function Index() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log(auth, 'auth <<<')
    console.log(db, 'db <<<')
    console.log(app, 'app <<<')

    // getCities(db).then()
  }, [])



  onAuthStateChanged(auth, (user) => {

    console.log(user, 'onAuthStateChanged' )

    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      const uid = user.uid;
      // ...
    } else {
      // User is signed out
      // ...
    }
  });

  const signUp = async () => {
    try {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed up
          const user = userCredential.user;

          console.log(user, 'user  createUserWithEmailAndPassword <<< ')

          setUser(user);
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;

          console.log(error, 'error <<<')
          // ..
        });

      // await auth().createUserWithEmailAndPassword(email, password);
      // alert('User created!');
    } catch (error) {
      alert(error.message);
    }
  };

  const signIn = async () => {
    try {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;

          setUser(user);

          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
        });
    } catch (error) {
      alert(error.message);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      alert('User signed out!');
    } catch (error) {
      alert(error.message);
    }
  };


  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>

      <View style={{ padding: 20 }}>
        <TextInput
          autoCapitalize="none"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={{ borderBottomWidth: 1, marginBottom: 10 }}
        />
        <TextInput
          autoCapitalize="none"
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={{ borderBottomWidth: 1, marginBottom: 20 }}
        />
        <Button title="Sign Up" onPress={signUp} />
        <Button title="Sign In" onPress={signIn} />
        <Button title="Sign Out" onPress={signOut} />
        {user && <Text>Welcome, {user.email}</Text>}
      </View>
    </View>
  );
}
