import {
    getFirestore,
    collection,
    getDocs, query, where, orderBy, limit, onSnapshot,
    addDoc,
    serverTimestamp,
    deleteDoc,
    updateDoc,
    deleteField,
    doc,
} from "firebase/firestore";
let database = null;

// initialize database reference
export function initializeDatabase(app) {
    database = getFirestore(app);
}

// write data
export function write(writeData, table, user) {
    addDoc(collection(database, table), {
        day: writeData.day,
        date: writeData.date,
        timeSheetType: writeData.timeSheetType,
        stime: writeData.stime,
        ftime: writeData.ftime,
        leaveEmail: writeData.leaveEmail,
        description: writeData.description,
        userId: writeData.userId,
        name: user.displayName,
        email: user.email,
        status: 'Inprocess',
        createdOn: serverTimestamp(),
    }).then(() => {
        console.log("firestoreDB.write -> Successfully add the data");
        // window.alert("firestoreDB.write -> Successfully added this week data");
        // callback();
    }).catch(err => {
        console.log("firestoreDB.write -> Error in adding the data");
        // window.alert("firestoreDB.write -> Error in adding the data");
        console.log(err.message);
    });
}

// function to read data snapshot
const readSnapshot = (snapshot) => {
    let timesheet = [];
    snapshot.forEach((doc) => {
        const data = doc.data();
        timesheet.push({
            day: data.day,
            date: data.date,
            timeSheetType: data.timeSheetType,
            stime: data.stime,
            ftime: data.ftime,
            leaveEmail: data.leaveEmail,
            description: data.description,
            userId: data.userId,
            status: data.status,
            name: data.name,
            email: data.email,
            key: doc.id,
        });
    });
    console.log("firestoreDB.readSnapshot");
    return timesheet;
};

// observe the change of data
export function observe(table, userId, callback) {
    const firestoreCollection = collection(database, table);
    const orderedquery = query(firestoreCollection, where("userId", "==", userId), orderBy("date", "desc"), limit(35));
    onSnapshot(orderedquery, (snapshot) => {
        console.log("firestoreDB.observe -> Successfully fetch the data");
        const data = readSnapshot(snapshot);
        callback(data);
    });
};

// observe the change of data
export function mobserve(table, userId, callback) {
    const firestoreCollection = collection(database, table);
    const orderedquery = query(firestoreCollection, where("userId", "==", userId), orderBy("date", "desc"), limit(35));
    onSnapshot(orderedquery, (snapshot) => {
        console.log("firestoreDB.observe -> Successfully fetch the data");
        const data = readSnapshot(snapshot);
        callback(data);
    });
};

// function to update the data
export function modifyStatus(modifyData, status, table, callback) {
    const timesheetRef = doc(database, table, modifyData.key);
    updateDoc(timesheetRef, {
        status: status,
        updatedOn: serverTimestamp(),
    }).then(() => {
        console.log("firestoreDB.modify -> Successfully update the data");
        callback();
    }).catch(err => {
        console.log("firestoreDB.modify -> Error in updating the data");
        console.log(err.message);
    });
};

