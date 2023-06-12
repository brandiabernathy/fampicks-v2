'use client'
import { useState, useEffect } from "react";
import { Games } from '../types';
import Matchup from './Matchup';

export default function MakePicks({ games, onClose }) {
    const [ picks, setPicks ] = useState([]);


    const selectTeam = (gameId: number, teamId: number) => {
        console.log('selectTeam', teamId);
        let pick = {
            game: gameId,
            team: teamId,
        }
        setPicks(prevState => ({
            ...prevState,
            pick,
        }));
    }

    console.log("props.games", games);
    let gamesList = games.map((game: any)=> {
		return <Matchup key={game.id} game={game} selectTeam={selectTeam}/>
	});

    const submitPicks = () => {
        console.log("picks", picks);
    }

	return (
		<div className="fixed top-0 right-0 bottom-0 left-0 z-20">
			<div className="absolute top-0 right-0 bottom-0 left-0 bg-slate-600 opacity-70"></div>
			<div className="absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 w-[600px] overflow-y-auto max-h-96">
                <div className="relative bg-white rounded p-8 drop-shadow">
                <h2 className="text-2xl">Make your picks for Week 1</h2>
                <div className="absolute right-4 top-2 text-xl cursor-pointer text-gray-300 z-10" onClick={onClose}>&times;</div>
                    {gamesList}
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