'use client'
import { useEffect, useState } from "react";
import { db } from '../utils/firebase/config';
import { getDocs, collection } from "firebase/firestore";
import { useAppContext } from '../context/app';

export default function Picks() {
    const { week } = useAppContext();
    const [weeklyPicks, setWeeklyPicks] = useState([]);

    console.log("week", week);

    const getPicks = async () => {
		try {
			const picks = await getDocs(collection(db, "picks"));
            picks.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data()[week].picks);
                let object = {
                    user: doc.id,
                    picks: doc.data()[week].picks,
                }
                setWeeklyPicks(prevState => [...prevState, object]);
                console.log('weekly picks', weeklyPicks);
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
		<div className="">
            { weeklyPicks.map((item: any) => {
                return (
                    <div key={item.user} className="mb-2">
                        <div className="font-bold">{item.user}</div>
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