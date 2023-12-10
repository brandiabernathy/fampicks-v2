'use client'
import { useState, useEffect } from "react";
import { db } from '../utils/firebase/config';
import { getDoc, setDoc, doc, updateDoc } from "firebase/firestore";
import { useAppContext } from '../context/app';
import Image from 'next/image';
import dayjs from 'dayjs';

export default function PickGames({ onClose }) {
    const { user, week } = useAppContext();
    const [ games, setGames ] = useState([]);
    const [ errorMsg, setErrorMsg ] = useState('');

    useEffect(() => {
        getTopGames();
    }, [])

    useEffect(() => {
        console.log('games', games);
    }, [games])


    const getTopGames = () => {
        fetch('http://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard?limit=1000&dates=20231016-20231023')
        .then((res) => res.json())
			.then((data) => {
				setGames(data.events
				.sort((a: any, b: any) => a.date < b.date ? -1 : 1)
                //filter out games where team does not have a Top 25 ranking and are not in the SEC
                .filter((game: any) => (game.competitions[0].competitors[0].curatedRank.current <= 25
                                        || game.competitions[0].competitors[1].curatedRank.current <= 25) &&
                                        (game.competitions[0].competitors[0].team.conferenceId != 8
                                        || game.competitions[0].competitors[1].team.conferenceId != 8))

				.map((game: any) => ({
					id: game.id,
					date_long: game.date,
					date: dayjs(game.date).format('M/D h:mmA'),
					home: game.competitions[0].competitors[0],
					away: game.competitions[0].competitors[1],
				})))
			})
    }


	return (
		<div className="fixed top-0 right-0 bottom-0 left-0 z-20">
			<div className="absolute top-0 right-0 bottom-0 left-0 bg-slate-600 opacity-70"></div>
			<div className="absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 w-[600px] overflow-y-auto max-h-96">
                <div className="relative bg-white rounded p-8 drop-shadow">
                    <h2 className="text-2xl">Pick the extra games for Week {week}</h2>
                    <div className="grid">
                        { games.map((game: any, index: any) => {
                            return (
                                <div key={index} className="flex items-center">
                                    <div className="flex flex-col items-center w-40">
                                        <Image
                                            src={game.away.team.logo}
                                            alt={game.away.team.location}
                                            width={80}
                                            height={80}
                                        />
                                        <div className="text-center">
                                            {game.away.curatedRank.current < 26 && <span className="text-slate-500 mr-1">{game.away.curatedRank.current}</span>}
                                            {game.away.team.displayName}
                                        </div>
                                    </div>
                                    <div className="mx-5">at</div>
                                    <div className="flex flex-col items-center w-40">
                                        <Image
                                            src={game.home.team.logo}
                                            alt={game.home.team.location}
                                            width={80}
                                            height={80}
                                        />
                                        <div className="text-center">
                                            {game.home.curatedRank.current < 26 && <span className="text-slate-500 mr-1">{game.home.curatedRank.current}</span>}
                                            {game.home.team.displayName}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    { errorMsg && <div className="text-rose-600">{errorMsg}</div> }
				</div>
			</div>
		</div>
	)
}