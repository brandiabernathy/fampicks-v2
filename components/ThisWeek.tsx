'use client';
import { useState, useEffect } from 'react';
import { useAppContext } from '../context/app';
import dayjs from 'dayjs';
import Game from './Game';
import Picks from './Picks';
import MakePicks from './MakePicks';
var utc = require('dayjs/plugin/utc')
dayjs.extend(utc);


export default function ThisWeek({ weekDates }) {
	const { user, week } = useAppContext();
    const [ games, setGames ] = useState([]);
    const [ showModal, setShowModal ] = useState(false);
	const [ disableButton, setDisableButton ] = useState(false);

    const closeModal = () => {
        setShowModal(false);
    }

	const getGames = () => {
		// console.log('get games');
		// fetch('http://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard?limit=1000&dates=' + weekDates.start + '-' + weekDates.end + '&groups=8')
		fetch('http://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard?limit=1000&dates=20220915-20221001&groups=8')
			.then((res) => res.json())
			.then((data) => {
                console.log("data", data);
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
				})))

				// const today = dayjs('2023-08-26 23:30:01').utc(true);
				const today = dayjs();
				if(dayjs(today).isAfter(games[0].date_long)) {
					// if first game of week has started, disable the picks button
					setDisableButton(true);
				}
				else {
					setDisableButton(false);
				}
			});
	}

	useEffect(() => {
		getGames();
	}, []);

    let gamesList = games.map((game: any)=> {
		return <Game key={game.id} game={game} />
	});


	return (
        <>
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl">This Week's Games</h2>
                {user && <button className={"text-white px-4 py-2 rounded-full " + (disableButton ? 'pointer-events-none opacity-50 bg-slate-600' : 'bg-teal-600')} onClick={() => setShowModal(true)}>Make my picks</button>}
            </div>
            <div className="grid gap-3 grid-cols-4">{gamesList}</div>
			<h2 className="text-xl mt-5 mb-3">This Week's Picks</h2>
			<Picks />
            {showModal && <MakePicks games={games} onClose={closeModal}/>}
        </>
	)
}
