'use client';
import { useState, useEffect } from 'react';
import { useAppContext } from '../context/app';
import dayjs from 'dayjs';
import Game from './Game';
import Picks from './Picks';
import MakePicks from './MakePicks';
import { db } from '../utils/firebase/config';
import { getDocs, collection, doc, updateDoc } from "firebase/firestore";
var utc = require('dayjs/plugin/utc')
dayjs.extend(utc);


export default function ThisWeek({ weekDates }) {
	const { user, week } = useAppContext();
    const [ games, setGames ] = useState([]);
    const [ showModal, setShowModal ] = useState(false);
	const [ disableButton, setDisableButton ] = useState(false);
	const [ allPicks, setAllPicks ] = useState([]);
	const picksCollectionRef = collection(db, "picks");


	const getAllPicks = async () => {
		try {
			const data = await getDocs(picksCollectionRef);
			const picksData =  data.docs.map((doc => ({
				...doc.data(),
				id: doc.id,
			})))
			setAllPicks(picksData);
		}
		catch(err) {
			console.error(err);
		}
	}

    const closeModal = () => {
        setShowModal(false);
    }

	const calculateScores = async() => {
		try {
			for(let j = 0; j < allPicks.length; j++) {
				const picksRef = doc(db, "picks", allPicks[j].id);
				await updateDoc(picksRef, {
					[week]: {
						score: allPicks[j][week].picks.filter(({ team }) => games.some((game) => game.winner === team)).length,
						//TODO not sure how to not override the picks, so doing this here
						picks: allPicks[j][week].picks,
					},
				});
			}
		}
		catch(err) {
			console.error(err);
		}
	}

	const getGames = () => {
		// console.log('get games');
		fetch('http://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard?limit=1000&dates=' + weekDates.start + '-' + weekDates.end + '&groups=8')
		// fetch('http://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard?limit=1000&dates=20220912-20220918&groups=8')
			.then((res) => res.json())
			.then((data) => {
                console.log("games data", data);
				setGames(data.events
				.sort((a: any, b: any) => a.date < b.date ? -1 : 1)
				.map((game: any) => ({
					id: game.id,
					date_long: game.date,
					date: dayjs(game.date).format('M/D h:mmA'),
					status: game.status,
					home: game.competitions[0].competitors[0],
					away: game.competitions[0].competitors[1],
					home_rank: game.competitions[0].competitors[0].curatedRank,
					away_rank: game.competitions[0].competitors[1].curatedRank,
					broadcast: game.competitions[0].broadcasts.length ? game.competitions[0].broadcasts[0].names[0] : '',
					winner: game.status.type.detail == 'Final' ?
											(game.competitions[0].competitors[0].winner ? game.competitions[0].competitors[0].id : game.competitions[0].competitors[1].id) : '',
				})))
			})
	}

	useEffect(() => {
		getGames();
		getAllPicks();
	}, []);

	useEffect(() => {
		if(games.length) {
			// const today = dayjs('2023-08-26 23:30:01').utc(true);
			const today = dayjs();
			if(dayjs(today).isAfter(games[0].date_long)) {
				// if first game of week has started, disable the picks button
				setDisableButton(true);
			}
			else {
				setDisableButton(false);
			}
		}
	}, [games]);

    let gamesList = games.map((game: any)=> {
		return <Game key={game.id} game={game} />
	});


	return (
        <>
            <div className="lg:flex justify-between items-center mb-3">
                <h2 className="text-xl">This Week's Games - Week {week}</h2>
                {user && <button className={"text-white px-4 py-2 rounded-full " + (disableButton ? 'pointer-events-none opacity-50 bg-slate-600' : 'bg-teal-600')} onClick={() => setShowModal(true)}>Make my picks</button>}
				{user.name == 'Brandi' && <button className={"text-white px-4 py-2 rounded-full " + (disableButton ? 'pointer-events-none opacity-50 bg-slate-600' : 'bg-teal-600')} onClick={() => calculateScores()}>Calculate scores</button>}
            </div>
            <div className="grid gap-3 lg:grid-cols-4">{gamesList}</div>
			<h2 className="text-xl mt-5 mb-3">This Week's Picks</h2>
			<Picks />
            {showModal && <MakePicks games={games} onClose={closeModal}/>}
        </>
	)
}
