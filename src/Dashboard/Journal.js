// import React, { useState } from 'react';
// import { db } from '../Firebase';
// import { collection, addDoc } from 'firebase/firestore';

// export default function Journal({ goal }) {
//   const [entry, setEntry] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await addDoc(collection(db, 'goals', goal.id, 'journal'), {
//         entry,
//         createdAt: new Date(),
//       });
//       setEntry('');
//     } catch (error) {
//       console.error('Error adding document: ',
//       console.error('Error adding document: ', error);
//     }
//   };

//   return (
//     <div>
//       <h2>Journal for {goal.title}</h2>
//       <form onSubmit={handleSubmit}>
//         <label>
//           Journal Entry:
//           <textarea
//             value={entry}
//             onChange={(e) => setEntry(e.target.value)}
//           ></textarea>
//         </label>
//         <button type="submit">Add Journal Entry</button>
//       </form>
//     </div>
//   );
// }
