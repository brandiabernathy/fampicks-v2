'use client';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import Game from './Game';

export default function ThisWeek() {
    const [games, setGames] = useState([]);

    useEffect(() => {
		fetch('http://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard?limit=1000&dates=20230831-20230906&groups=8')
			.then((res) => res.json())
			.then((data) => {
                // console.log("data", data);
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
                    broadcast: game.competitions[0].broadcasts[0].names[0],
				})))
			});
	}, []);

    console.log("games", games);
    let gamesList = games.map((game: any)=> {
		return <Game key={game.id} game={game} />
	});


	return (
        <>
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl">This Week's Games</h2>
                <button className="bg-teal-600 text-white px-4 py-2 rounded-full" onClick={() =>{} }>Make my picks</button>
            </div>
            <div className="grid gap-3 grid-cols-4">{gamesList}</div>
        </>
	)
}
