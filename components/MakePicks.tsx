'use client'
import { useState, useEffect } from "react";
import { db } from '../utils/firebase/config';
import { getDoc, setDoc, doc, updateDoc } from "firebase/firestore";
import { useAppContext } from '../context/app';

export default function MakePicks({ games, onClose }) {
    const { user, week } = useAppContext();
    const [ picks, setPicks ] = useState([]);
    const [ errorMsg, setErrorMsg ] = useState('');

    const getUserPicks = async () => {
         // see if user has already made picks for current week, and load them
         try {
             const userPicks = await getDoc(doc(db, 'picks', user.uid));
             if(userPicks.data()[week]) {
                setPicks(userPicks.data()[week].picks);
             }
         }
         catch(err) {
             console.error(err);
         }
    }

    useEffect(() => {
       getUserPicks();
    }, []);

    useEffect(() => {
        console.log('picks', picks);
    },[picks])

    function makeSelection(index: Number, game: string, team: string, teamName: string) {
        let newPick = {
            id: index,
            game: game,
            team: team,
            teamName: teamName,
        }
        if(picks.some(function(el){ return el['game'] === game})) {
            // remove current pick for game and add new one
            var array = [...picks];
            let index = array.findIndex(item => item['game'] === game);
            array.splice(index, 1);
            array.push(newPick);
            setPicks(array);
        }
        else {
            setPicks(prevState => [...prevState, newPick]);
        }
    }

    const submitPicks = async () => {
        if(picks.length < games.length) {
            setErrorMsg('Make sure you have selected a winner for all games.');
        }
        else {
            setErrorMsg('');
            try {
                const userPicks = await getDoc(doc(db, 'picks', user.uid));
                const picksRef = doc(db, "picks", user.uid);

                if(!userPicks.data()) {
                    // if user has not made any picks yet, create a new doc in the picks collection
                    // and add their picks to it
                    await setDoc(doc(db, "picks", user.uid), {
                        name: user.name,
                        [week]: {
                            picks: picks
                        },
                    });
                }
                else {
                    // update their picks collection with the new picks
                    await updateDoc(picksRef, {
                        [week]: {
                            picks: picks
                        },
                    });
                }
                onClose();
            }
            catch(err) {
                console.error(err);
            }
        }
    }

	return (
		<div className="fixed top-0 right-0 bottom-0 left-0 z-20">
			<div className="absolute top-0 right-0 bottom-0 left-0 bg-slate-600 opacity-70"></div>
			<div className="absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 w-[600px] overflow-y-auto max-h-96">
                <div className="relative bg-white rounded p-8 drop-shadow">
                <h2 className="text-2xl">Make your picks for Week {week}</h2>
                <div className="absolute right-4 top-2 text-xl cursor-pointer text-gray-300 z-10" onClick={onClose}>&times;</div>
                    { games.map((game: any, index: any) => {
                        return (
                            <div className="flex gap-8 relative w-full my-5" key={game.id}>
                                <div
                                    className={"w-1/2 cursor-pointer" + ((picks.findIndex(item => item.game === game.id) > -1 && picks.findIndex(item =>item.team === game.away.id) === -1) ? ' opacity-50' : '')} 
                                    onClick={() => makeSelection(index, game.id, game.away.id, game.away.team.location)}
                                >
                                    <div className="text-xs mb-1">
                                        <div className="text-slate-500">Away</div>
                                        <div className="font-bold">{game.away.team.displayName}</div>
                                    </div>
                                    <div className="rounded-lg text-center p-10 relative" style={{ backgroundColor: `#${game.away.team.color}`}}>
                                        <div className="text-white font-bold text-2xl">
                                            { game.away_rank.current != 99 && <span>#{game.away_rank.current}</span> }
                                            <span className="ml-2">{game.away.team.abbreviation}</span>
                                        </div>
                                        {picks.findIndex(item => item.team === game.away.id) > -1 &&
                                        <div className="absolute h-8 w-8 bottom-4 right-4 rounded-full bg-emerald-500 flex items-center justify-center">
                                            <div className="w-2 h-4 rotate-45 border-r-2 border-b-2 border-white"></div>
                                        </div>}
                                    </div>
                                </div>
                                <div
                                    className={"w-1/2 cursor-pointer" + ((picks.findIndex(item => item.game === game.id) > -1 && picks.findIndex(item =>item.team === game.home.id) === -1) ? ' opacity-50' : '')}
                                    onClick={() => makeSelection(index, game.id, game.home.id, game.home.team.location)}
                                >
                                    <div className="text-xs text-right mb-1">
                                        <div className="text-slate-500">Home</div>
                                        <div className="font-bold">{game.home.team.displayName}</div>
                                    </div>
                                    <div className="rounded-lg text-center p-10 relative" style={{ backgroundColor: `#${game.home.team.color}`}}>
                                        <div className="text-white font-bold text-2xl">
                                            { game.home_rank.current != 99 && <span>#{game.home_rank.current}</span> }
                                            <span className="ml-2">{game.home.team.abbreviation}</span>
                                        </div>
                                        {picks.findIndex(item => item.team === game.home.id) > -1 &&
                                         <div className="absolute h-8 w-8 bottom-4 right-4 rounded-full bg-emerald-500 flex items-center justify-center">
                                            <div className="w-2 h-4 rotate-45 border-r-2 border-b-2 border-white"></div>
                                        </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                    { errorMsg && <div className="text-rose-600">{errorMsg}</div> }
                    <button
						className="px-4 py-2 mt-4 rounded-full w-full bg-teal-600 hover:bg-teal-800 text-white"
						type="submit"
						onClick={submitPicks}
					>
						Submit
					</button>
				</div>
			</div>
		</div>
	)
}