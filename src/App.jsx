import React, { useState, useEffect } from 'react';
import { db } from './firebaseConfig';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const App = () => {
  const [data, setData] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [updateItem, setUpdateItem] = useState('');
  const [currentId, setCurrentId] = useState(null);

  const fetchData = async () => {
    const querySnapshot = await getDocs(collection(db, 'items'));
    const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setData(items);
  };

  const addItem = async () => {
    if (newItem.trim() === '') return;
    await addDoc(collection(db, 'items'), { name: newItem });
    setNewItem('');
    fetchData();
  };

  const updateItemById = async () => {
    if (updateItem.trim() === '' || !currentId) return;
    const itemDoc = doc(db, 'items', currentId);
    await updateDoc(itemDoc, { name: updateItem });
    setUpdateItem('');
    setCurrentId(null);
    fetchData();
  };

  const deleteItemById = async (id) => {
    const itemDoc = doc(db, 'items', id);
    await deleteDoc(itemDoc);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1>CRUD con Firebase y React</h1>
      <div>
        <input
          type="text"
          placeholder="Nuevo ítem"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        />
        <button onClick={addItem}>Agregar</button>
      </div>
      <ul>
        {data.map(item => (
          <li key={item.id}>
            {item.name}
            <button onClick={() => {
              setCurrentId(item.id);
              setUpdateItem(item.name);
            }}>Editar</button>
            <button onClick={() => deleteItemById(item.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
      {currentId && (
        <div>
          <input
            type="text"
            placeholder="Actualizar ítem"
            value={updateItem}
            onChange={(e) => setUpdateItem(e.target.value)}
          />
          <button onClick={updateItemById}>Actualizar</button>
          <button onClick={() => {
            setCurrentId(null);
            setUpdateItem('');
          }}>Cancelar</button>
        </div>
      )}
    </div>
  );
};

export default App;