'use client';
import { useState, useEffect } from 'react';
import { useAppContext } from '../context/app';
import dayjs from 'dayjs';
import Game from './Game';
import MakePicks from './MakePicks';
import weeks from '../utils/weeks';
var isBetween = require('dayjs/plugin/isBetween')
dayjs.extend(isBetween)


export default function ThisWeek() {
	const { user, week, setWeek } = useAppContext();
    const [ games, setGames ] = useState([]);
    const [ showModal, setShowModal ] = useState(false);
	const [ startDate, setStartDate] = useState('');
	const [ endDate, setEndtDate] = useState('');

    const closeModal = () => {
        setShowModal(false);
    }

    useEffect(() => {
		// figure out what week it is
		const weekNumbers = Object.keys(weeks);
		const today = dayjs().format('YYYYMMDD');

		// if today is before the first week start date
		if(dayjs(today).isBefore(weeks[weekNumbers[0]].start_date)) {
			setWeek(1);
			setStartDate(weeks[weekNumbers[0]].start_date);
			setEndtDate(weeks[weekNumbers[0]].end_date);
		}
		else {
			for(let i = 0; i < weekNumbers.length -1; i++) {
				//if today is in between the start and end dates
				if(dayjs(today).isBetween(weeks[weekNumbers[i]].start_date, weeks[weekNumbers[i+1]].start_date) || today == weeks[weekNumbers[i]].start_date) {
					setWeek(i+1);
					setStartDate(weeks[weekNumbers[i+1]].start_date);
					setEndtDate(weeks[weekNumbers[i+1]].end_date);
				}
				else if(dayjs(today).isBefore(weeks[weekNumbers[0]].start_date)) {
					setWeek(1);
				}
			}
		}
	}, []);

	useEffect(() => {
		fetch('http://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard?limit=1000&dates=' + startDate + '-' + endDate + '&groups=8')
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
            {showModal && <MakePicks games={games} onClose={closeModal}/>}
        </>
	)
}
