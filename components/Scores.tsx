'use client';
import { db } from '../utils/firebase/config';
import { useState, useEffect } from 'react';
import { getDocs, collection } from "firebase/firestore";

export default function Scores() {

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
            <div className="flex justify-between" key={person.id}>
                <span className="capitalize mr-2">{person.name}</span>
                <span>{person.score}</span>
            </div>
        )
	});

	return (
        <div className="grid grid-cols-6">{scoresList}</div>
	)
}
