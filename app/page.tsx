'use client'
import Scores from '../components/Scores';
import ThisWeek from '../components/ThisWeek';
import { auth } from "../utils/firebase/config";
import { useUserContext } from '../context/user';
import { onAuthStateChanged } from "firebase/auth";

export default function Home() {
	const { user, setUser } = useUserContext();

	onAuthStateChanged(auth, (user) => {
		// user is signed in
		if (user) {
			console.log("user", user);
			setUser(user.uid);
		}
	  });

	return (
		<>
		{/* <Scores /> */}
		<ThisWeek />
		</>
	)
}
