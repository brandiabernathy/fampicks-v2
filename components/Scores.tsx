'use client';
import { db } from '../utils/firebase/config';
import { useState, useEffect } from 'react';
import { getDocs, collection } from "firebase/firestore";

export default function Header() {

    const [ scores, setScores ] = useState<any[]>([]);

	const scoresCollectionRef = collection(db, "scores");

    const getScores = async () => {
        try {
            const data = await getDocs(scoresCollectionRef);
            const filteredData =  data.docs.map((doc => ({
                ...doc.data(),
                id: doc.id,
            })))
            setScores(filteredData);
        }
        catch(err) {
            console.error(err);
        }
    };

    useEffect(() => {
        getScores();
    }, []);

    let scoresList = scores.map((person: any)=> {
		return (
            <div key={person.id}>
                <div className="capitalize">{person.name}</div>
                <div>{person.score}</div>
            </div>
        )
	});

	return (
        <div>{scoresList}</div>
	)
}
