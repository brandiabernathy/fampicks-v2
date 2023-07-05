'use client'
import { useEffect } from "react";
import Scores from '../components/Scores';
import ThisWeek from '../components/ThisWeek';
import Picks from '../components/Picks';
import { db } from '../utils/firebase/config';
import { auth } from "../utils/firebase/config";
import { useAppContext } from '../context/app';
import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";

export default function Home() {
	const { user, setUser } = useAppContext();

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			// user is signed in
			if (user) {
				getUser(user.uid);
			}
		  });
    }, []);

	const getUser = async (userId) => {
		const user = await getDoc(doc(db, 'users', userId))
		setUser(user.data());
	}

	return (
		<>
		{/* <Scores /> */}
		<ThisWeek />
		<Picks />
		</>
	)
}
