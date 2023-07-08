'use client';
import { useState, useEffect } from 'react';
import { useAppContext } from '../context/app';
import dayjs from 'dayjs';
import Game from './Game';
import Picks from './Picks';
import MakePicks from './MakePicks';
var isBetween = require('dayjs/plugin/isBetween')
dayjs.extend(isBetween)


export default function ThisWeek({ startDate, endDate }) {
	const { user, week } = useAppContext();
    const [ games, setGames ] = useState([]);
    const [ showModal, setShowModal ] = useState(false);

    const closeModal = () => {
        setShowModal(false);
    }

	useEffect(() => {
		fetch('http://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard?limit=1000&dates=' + startDate + '-' + endDate + '&groups=8')
		// fetch('http://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard?limit=1000&dates=20220915-20221001&groups=8')
			.then((res) => res.json())
			.then((data) => {
                console.log("data", data);
				setGames(data.events
				.sort((a: any, b: any) => a.date < b.date ? -1 : 1)
				.map((game: any) => ({
					id: game.id,
					date: dayjs(game.date).format('M/D h:mmA'),
					status: game.status,
					home: game.competitions[0].competitors[0],
					away: game.competitions[0].competitors[1],
					home_rank: game.competitions[0].competitors[0].curatedRank,
					away_rank: game.competitions[0].competitors[1].curatedRank,
                    broadcast: game.competitions[0].broadcasts.length ? game.competitions[0].broadcasts[0].names[0] : '',
				})))
			});
	}, [week]);

    let gamesList = games.map((game: any)=> {
		return <Game key={game.id} game={game} />
	});


	return (
        <>
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl">This Week's Games</h2>
                {user && <button className="bg-teal-600 text-white px-4 py-2 rounded-full" onClick={() => setShowModal(true)}>Make my picks</button>}
            </div>
            <div className="grid gap-3 grid-cols-4">{gamesList}</div>
			<h2 className="text-xl mt-5 mb-3">This Week's Picks</h2>
			<Picks />
            {showModal && <MakePicks games={games} onClose={closeModal}/>}
        </>
	)
}
