'use client'
import { useState } from "react";
import { auth } from "../utils/firebase/config";
import { db } from '../utils/firebase/config';
import { collection, addDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function Auth({ onClose }) {
	const [ email, setEmail ] = useState('');
	const [ password, setPassword ] = useState('');
	const [ fname, setFname ] = useState('');

	const usersCollectionRef = collection(db, "users");

	const signIn = async () => {
		try {
			let user = await createUserWithEmailAndPassword(auth, email, password);
			addUser(user.user.uid);
			onClose();
		}
		catch(err) {
			console.error(err);
		}
	}

	const addUser = async (userId: string) => {
		try {
			await addDoc(usersCollectionRef, {id: userId, name: fname});
		}
		catch(err) {
			console.error(err);
		}
	}

	return (
		<div className="fixed top-0 right-0 bottom-0 left-0 z-20">
			<div className="absolute top-0 right-0 bottom-0 left-0 bg-slate-600 opacity-70"></div>
			<div className="absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 w-96 overflow-y-auto">
				<form className="relative bg-white rounded p-8 drop-shadow">
					<div className="absolute right-4 top-2 text-xl cursor-pointer text-gray-300" onClick={onClose}>&times;</div>
					<div className="text-2xl mb-8">Sign in</div>
					<div className="mb-6">
						<label className="text-gray-500 block mb-2">First Name</label>
						<input
							className="border rounded w-full py-2 px-3"
							id="fname"
							name="fname"
							type="text"
							onChange={(e) => setFname(e.target.value)}
						/>
					</div>
					<div className="mb-6">
						<label className="text-gray-500 block mb-2">Email</label>
						<input
							className="border rounded w-full py-2 px-3"
							id="email"
							name="email"
							type="email"
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
					<div className="mb-10">
						<label className="text-gray-500 block mb-2">Password</label>
						<input
							className="border rounded w-full py-2 px-3"
							id="password"
							name="password"
							type="password"
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>

					<button
						className="px-4 py-2 rounded-full w-full bg-teal-600 hover:bg-teal-800 text-white"
						type="button"
						onClick={signIn}
					>
						Sign in
					</button>
				</form>
			</div>
		</div>
	)
}