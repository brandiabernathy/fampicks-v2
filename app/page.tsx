'use client'
import { useEffect, useState } from "react";
import Scores from '../components/Scores';
import GamesList from '../components/GamesList';
import Picks from '../components/Picks';
import { db } from '../utils/firebase/config';
import { auth } from "../utils/firebase/config";
import { useAppContext } from '../context/app';
import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import dayjs from 'dayjs';
import weeks from '../utils/weeks';
var isBetween = require('dayjs/plugin/isBetween')
dayjs.extend(isBetween)

export default function Home() {
	const { user, setUser, setWeek } = useAppContext();
	const [ weekDates, setWeekDates ] = useState({ start: '', end: ''});

	useEffect(() => {
		//see if a user is already signed in
		onAuthStateChanged(auth, (user) => {
			if (user) {
				getUser(user.uid);
			}
		});



		// figure out what week it is
		const weekNumbers = Object.keys(weeks);
		const today = dayjs().format('YYYYMMDD');
		// const today = dayjs('20230920').format('YYYYMMDD');

		// if today is before the first week start date
		if(dayjs(today).isBefore(weeks[weekNumbers[0]].start_date)) {
			setWeek(0);
			setWeekDates({start: weeks[weekNumbers[0]].start_date, end: weeks[weekNumbers[0]].end_date})
		}
		// if today is after the last regular week
		else if(dayjs(today).isAfter(weeks[weekNumbers[14]].end_date)) {
			setWeek(99);
			setWeekDates({start: weeks[weekNumbers[15]].start_date, end: weeks[weekNumbers[15]].end_date})
		}
		else {
			for(let i = 0; i < weekNumbers.length -1; i++) {
				//if today is in between the start and end dates
				if(dayjs(today).isBetween(weeks[weekNumbers[i]].start_date, weeks[weekNumbers[i+1]].start_date) || today == weeks[weekNumbers[i]].start_date) {
					setWeek(i);
					setWeekDates({start: weeks[weekNumbers[i]].start_date, end: weeks[weekNumbers[i]].end_date})
				}
			}
		}
    }, []);

	const getUser = async (userId: any) => {
		const docRef = doc(db, "users", userId);
		const user = await getDoc(docRef);
		if (user.exists()) {
			// not a brand new user
			setUser(user.data());
		  }
	}

	return (
		<>
			<div className="flex justify-between mb-6">
				<div className="w-3/4">
					{ weekDates.start && <GamesList weekDates={weekDates} /> }
				</div>
				<div className="w-1/5">
					<Scores />
				</div>
			</div>
			<Picks />
		</>
	)
}
