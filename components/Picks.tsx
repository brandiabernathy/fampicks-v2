'use client'
import { useEffect, useState } from "react";
import { db } from '../utils/firebase/config';
import { getDocs, collection } from "firebase/firestore";
import { useAppContext } from '../context/app';

export default function Picks() {
    const { week } = useAppContext();
    const [weeklyPicks, setWeeklyPicks] = useState([]);

    const getPicks = async () => {
		try {
			const picks = await getDocs(collection(db, "picks"));
            // get everyone's picks
            picks.forEach((doc) => {
                // check to see if user has made picks for this week yet
                if(doc.data()[week]) {
                    let userObject = {
                        uid: doc.id,
                        name: doc.data().name,
                        picks: doc.data()[week].picks,
                        score: doc.data()[week].score,
                    }
                    setWeeklyPicks(prevState => [...prevState, userObject]);
                }
            });
		}

		catch(err) {
			console.error(err);
		}
	}

    useEffect(() => {
        getPicks();
    }, [week])


	return (
        <>
            <h2 className="text-xl mb-5">This Week's Picks</h2>
            <div className="flex">
                { weeklyPicks.map((item: any) => {
                    return (
                        <div key={item.uid} className="lg:w-1/6">
                            <div className="font-bold">{item.name} {item.score && <span>- {item.score} </span>}</div>
                            { item.picks.map((pick: any) => {
                                return (
                                    <div key={pick.game}>{pick.teamName}</div>
                                )
                            })}
                        </div>
                    )
                })}
            </div>
        </>
	)
}