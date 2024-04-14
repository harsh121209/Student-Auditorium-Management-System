import {initializeApp} from "firebase/app";

import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  deleteUser,
} from "firebase/auth";

import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
  getCountFromServer,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import {getStorage} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDNCuEZvnXSK9JbAMBfDj3YeO4x5UC37FY",
  authDomain: "sams-29650.firebaseapp.com",
  projectId: "sams-29650",
  storageBucket: "sams-29650.appspot.com",
  messagingSenderId: "420555374271",
  appId: "1:420555374271:web:820e21c382ba5ef329100a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
console.log(auth);
// console.log(auth.currentUser.auth);

const db = getFirestore(app);
const storage = getStorage(app);

const googleProvider = new GoogleAuthProvider();

const admin = collection(db, "admin");
const salesPerson = collection(db, "salesPerson");
const accountant = collection(db, "accountant");
const createdshows = collection(db, "createdshows");
const shows = collection(db, "shows");

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const user_typ = async (email) => {
  try {
    let q = query(admin, where("email", "==", email));

    let snapshot = await getCountFromServer(q);
    if (snapshot.data().count >= 1) {
      return "admin";
    }

    q = query(salesPerson, where("email", "==", email));

    snapshot = await getCountFromServer(q);
    if (snapshot.data().count >= 1) {
      return "salesPerson";
    }
    q = query(accountant, where("email", "==", email));

    snapshot = await getCountFromServer(q);
    if (snapshot.data().count >= 1) {
      return "accountant";
    }
  } catch (err) {
    console.error(err);
    // alert(err.message);
    throw err;
  }
};
const logInWithEmailAndPassword = async (email, password) => {
  try {
    console.log(email, password);
    await signInWithEmailAndPassword(auth, email, password);
    console.log("came to login func");
    let user;
    await user_typ(email)
      .then((val) => {
        user = val;
      })
      .catch((err) => console.log(err));

    return user;
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const snapshot = await getCountFromServer(admin);
    if (snapshot.data().count != 0) {
      alert("An Admin Already exists.. go to login ");
      return;
    }
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(admin, {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
const registerEmployee = async (name, email, password, userType) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);

    const user = res.user;

    if (userType.toLowerCase() === "salesperson") {
      const qu = query(salesPerson, where("email", "==", email));

      const snapshot = await getCountFromServer(qu);
      console.log("came here Line 136");
      if (snapshot.data().count == 0) {
        await addDoc(salesPerson, {
          uid: user.uid,
          name,
          authProvider: "local",
          email,
          password,
        });
        alert("SalesPerson added Successfully");
      } else {
        alert("SalesPerson already Added");
      }
    }
    if (userType.toLowerCase() === "accountant") {
      const qu = query(accountant, where("email", "==", email));

      const snapshot = await getCountFromServer(qu);

      if (snapshot.data().count == 0) {
        await addDoc(accountant, {
          uid: user.uid,
          name,
          authProvider: "local",
          email,
          password,
        });
        alert("Accountant added Successfully");
      } else {
        alert("Accountant already Added");
      }
    }
    logout();

    let q = query(admin);
    const querySnapshot = await getDocs(q);
    let adminMail, adminPassword;
    querySnapshot.forEach((doc) => {
      adminMail = doc.data().email;
      adminPassword = doc.data().password;
    });

    await logInWithEmailAndPassword(adminMail, adminPassword);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
const setShow = async (date, slot, hostname, showname, seatprice) => {
  try {
    let slots = [];
    for (let i = 0; i < 5; i++) {
      slots[i] = false;
    }
    let arr = [];
    for (let i = 0; i < 20; i++) {
      let temp = "00000000000000000000";

      arr.push(temp);
    }
    //  arr[0]=[];
    slots[Number(slot)] = true;
    const qu = query(shows, where("date", "==", date));
    let docRef;
    const snapshot = await getCountFromServer(qu);

    if (snapshot.data().count == 0) {
      await addDoc(shows, {
        date,
        slots,
      });
      await addDoc(createdshows, {
        date,
        hostname,
        slotnumber: slot,
        seats: arr,
        showname,
        seatprice,
      });
    }
    if (snapshot.data().count != 0) {
      let content = await getDocs(qu);

      content.forEach((doc) => {
        docRef = {...doc.data(), id: doc.id};
      });
      if (docRef.slots[Number(slot)] == true) return false;
      for (let i = 0; i < 5; i++) {
        slots[i] = docRef.slots[i];
      }
      docRef.slots[Number(slot)] = true;
      const updateShow = doc(db, "shows", docRef.id);
      await updateDoc(updateShow, {
        date: docRef.date,
        slots: docRef.slots,
      });
      await addDoc(createdshows, {
        date,
        hostname,
        slotnumber: slot,
        seats: arr,
        showname,
        seatprice,
      });
    }
    return true;
  } catch (err) {
    console.log(err.message);
    alert(err.message);
  }
};
const deleteShow = async (date, slot) => {
  try {
    const q1 = query(
      createdshows,
      where("date", "==", date),
      where("slotnumber", "==", slot)
    );
    let snapshot = await getCountFromServer(q1);
    if (snapshot.data().count == 0) {
      console.log("zero docs in q1");

      return true;
    }
    let content = await getDocs(q1);
    let deleteDocId;
    content.forEach((doc) => {
      deleteDocId = doc.id;
    });

    const delete_doc = doc(db, "createdshows", deleteDocId);

    await deleteDoc(delete_doc);

    const q2 = query(shows, where("date", "==", date));
    content = await getDocs(q2);
    snapshot = await getCountFromServer(q2);

    let id, docRef;

    content.forEach((doc) => {
      id = doc.id;
      docRef = {...doc.data()};
    });
    let ind = Number(slot);
    docRef.slots[ind] = false;
    const updateShow = doc(db, "shows", id);
    await updateDoc(updateShow, {
      date: docRef.date,
      slots: docRef.slots,
    });
    return true;
  } catch (err) {
    console.log(err.message);
    alert(err.message);
  }
};
const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logout = () => {
  signOut(auth);
};
const getObj = async (email, userType) => {
  try {
    console.log(userType, email);
    let q;
    if (userType == "admin") q = query(admin, where("email", "==", email));
    else if (userType == "salesPerson") {
      q = query(salesPerson, where("email", "==", email));
    } else if (userType == "accountant") {
      q = query(accountant, where("email", "==", email));
      console.log("logger");
    }
    // const snapshot = await getCountFromServer(q);
    // console.log(snapshot.data().count);
    const querySnapshot = await getDocs(q);
    const t = await getCountFromServer(q);
    console.log(t.data().count);
    console.log("came here : ");
    let Obj;
    querySnapshot.forEach((doc) => {
      // console.log(doc.id, " => ", doc.data());

      Obj = doc.data();
    });
    return Obj;
  } catch (err) {
    console.log(err.message);
    alert(err.message);
  }
};

const delete_user = async (userType, adminMail, adminPassword) => {
  console.log("logger");
  let email = auth?.currentUser?.email;

  let docRef, q;
  if (userType == "accountant")
    q = query(accountant, where("email", "==", email));
  if (userType == "salesPerson")
    q = query(salesPerson, where("email", "==", email));

  let content = await getDocs(q);
  content.forEach((doc) => {
    docRef = {...doc.data(), id: doc.id};
  });

  const delete_doc = doc(db, userType, docRef.id);
  await deleteDoc(delete_doc);
  const user = auth.currentUser;

  deleteUser(user)
    .then(async () => {
      alert("User account deleted ");
      await logInWithEmailAndPassword(adminMail, adminPassword);
      alert(auth?.currentUser?.email);
    })
    .catch((error) => {
      console.log(error.message);
      alert(error.message);
    });
};

export {
  auth,
  db,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
  storage,
  registerEmployee,
  getObj,
  delete_user,
  setShow,
  deleteShow,
};