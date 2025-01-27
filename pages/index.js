import { useEffect, useState } from 'react';
import db from '@/lib/firebase';
// import { db } from '@/lib/firebaseAdmin';
import { collection, getDocs, getDoc, doc } from 'firebase/firestore';

export default function Home() {
  const [data, setData] = useState([]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       // Recursive function to fetch subcollections.
  //       const fetchSubcollections = async (docRef) => {
  //         const subcollections = {}; // To store subcollection data
  
  //         // Add known subcollection names here if you want to limit fetching
  //         const subcollectionNames = ['Users', 'Buckets', 'Challenges'];
  
  //         for (const subcollectionName of subcollectionNames) {
  //           const subcollectionRef = collection(docRef, subcollectionName);
  //           const subSnapshot = await getDocs(subcollectionRef);
  
  //           subcollections[subcollectionName] = subSnapshot.docs.map((subDoc) => {
  //             const subDocData = subDoc.data();
  //             return { id: subDoc.id, ...subDocData };
  //           });
  //         }
  
  //         return subcollections;
  //       }; 
  
  //       // Fetch main collection and their subcollections
  //       const querySnapshot = await getDocs(collection(db, 'Applications'));
  //       const fullData = await Promise.all(
  //         querySnapshot.docs.map(async (doc) => {
  //           const docData = doc.data();
  //           const subcollections = await fetchSubcollections(doc.ref);
  //           return { id: doc.id, ...docData, subcollections };
  //         })
  //       );
  
  //       console.log(fullData); // Logs the full collection with subcollections
  //       setData(fullData);
  //     } catch (error) {
  //       console.error("Error fetching data: ", error);
  //     }
  //   };
  
  //   fetchData();
  // }, []);

  return (
    <div>
      <h1>Firestore Data</h1>
      {/* <ul>
        {data.map((item, index) => (
          <li key={index}>{JSON.stringify(item)}</li>
        ))}
      </ul> */}
    </div>
  );
}
