// import Game from './Game';
'use client'
import React from 'react';
import axios from 'axios';
import Game from './Game';
import { useState, useEffect } from 'react';
import { DateTime } from "luxon";

export default function Week() {
	console.log('hi');
	const [games, setGames] = React.useState([]);

	useEffect(() => {
		axios
		.get('http://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard?limit=1000&groups=8')
		.then(response => {
			// console.log(response.data.events);
			setGames(response.data.events.map(game => ({
				week: game.week.number,
				id: game.id,
				date: game.date,
				status: game.status,
				home_team: game.competitions[0].competitors[0].team.location,
				home_score: parseInt(game.competitions[0].competitors[0].score),
				away_team: game.competitions[0].competitors[1].team.location,
				away_score: parseInt(game.competitions[0].competitors[1].score),
				home_logo: game.competitions[0].competitors[0].team.logo,
				away_logo: game.competitions[0].competitors[1].team.logo,
			})));
		})
	}, []);

	let events = games.map(item => {
		return <Game key={item.id} game={item} />
	});
	return (
		<section className="flex flex-wrap">
			{ events }
		</section>
	)
}
