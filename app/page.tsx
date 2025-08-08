'use client'

import Image from "next/image";
import axios from "axios";

import { useEffect, useState } from "react";

const BASE = "http://localhost:8080";


export default function Home() {
  const [users, setUsers] = useState<any[]>([]);
  const [username, setUsername] = useState<string>("");
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setloading] = useState<boolean>(false);

  useEffect(() => {
    fetcUsers();
  }, []);

  async function fetcUsers() {
    try {
      setloading(true);

      const res = await axios.get(`${BASE}/users`);

      console.log(res.data);

      setUsers(res.data as any[])

    } catch (e: any) {
      alert(`Neizdevās ielādēt : ${e?.message || e}`);
    } finally {
      setloading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      if (!username.trim()) {
        alert("Lauks 'username' ir obligāts!")
        return;
      }

      if (editId) {
        await axios.put(`${BASE}/update/${editId}`, { username });
      } else {
        await axios.post(`${BASE}/create`, { username })
      }

      setUsername("");
      setEditId(null);
      fetcUsers();
    } catch (e: any) {
      alert(`Neizdevās saglabāt: ${e?.message} || e`)
    }
  }

  function handleEdit(user: any) {
    setUsername(user.username || "")
    setEditId(Number(user.id));
  }

  async function handleDelete(id: number) {
    try {
      await axios.delete(`${BASE}/delete/${id}`);
      fetcUsers();
    } catch (e: any) {
      alert(`Neizdevās dzēst: ${e?.message || e}`);
    }
  }

  return (
    <main className="flex flex-col justify-center items-center p-20">
      <h1 className="text-3xl">User Management</h1>

      <form onSubmit={handleSubmit} className="mt-20">

        <input type="text" placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} className="border border-gray-300 rounded-md p-2" />

        <button type="submit" className="bg-blue-500 text-white rounded-md p-2">
          {editId ? "Update" : "Add"}
        </button>

      </form>

      {loading ? (
        <p>Ielādē...</p>
      ) : (
        <ul className="mt-10 flex flex-col gap-4">
          {users.map((user: any) => (
            <li key={user.id} className="flex gap-4 items-center border border-gray-400 p-3 rounded-md">
              <p>ID: {user.id}{""}</p>
              <p>Username: {user.username}</p>

              <div className="flex gap-4">
                <button onClick={() => handleEdit(user)} className="px-3 py-1 border border-gray-400 rounded-md">Edit</button>
                <button onClick={() => handleDelete(Number(user.id))} className="px-3 py-1 border border-red-600 rounded-md bg-red-600 text-white">Delete</button>
              </div>
            </li>
          ))}
          {users.length === 0 && <li>Nav lietotāju..</li>}
        </ul>
      )}

    </main>
  );
}