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
            picks.forEach((doc) => {
                // get everyone's pics
                let object = {
                    uid: doc.id,
                    name: doc.data().name,
                    picks: doc.data()[week].picks,
                }
                setWeeklyPicks(prevState => [...prevState, object]);
            });
		}

		catch(err) {
			console.error(err);
		}
	}

    useEffect(() => {
        getPicks();
        // console.log('get picks');
        // console.log("week", week);
    }, [week])


	return (
		<div className="">
            { weeklyPicks.map((item: any) => {
                return (
                    <div key={item.user} className="mb-2">
                        <div className="font-bold">{item.name}</div>
                        { item.picks.map((pick: any) => {
                            return (
                                <span key={pick.game} className="border-slate-300 border-r-2 pr-2 mr-2 last:border-0">{pick.teamName}</span>
                            )
                        })}
                    </div>
                )
            })}
		</div>
	)
}