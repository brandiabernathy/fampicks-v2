'use client'
import { useState, useEffect } from "react";
import { db } from '../utils/firebase/config';
import { getDoc, setDoc, doc, updateDoc } from "firebase/firestore";
import { useAppContext } from '../context/app';
import Game from './Game';
import Image from 'next/image';
import dayjs from 'dayjs';

export default function PickGames({ onClose }) {
    const { user, week } = useAppContext();
    const [ games, setGames ] = useState([]);
    const [ errorMsg, setErrorMsg ] = useState('');
    const [ selectedConference, setSelectedConference ] = useState('');

    const conferences = [
        {
            id: 9,
            name: 'Pac-12',
            logo: '/pac12-logo.svg'
        },
        {
            id: 4,
            name: 'Big 12',
            logo: '/big12-logo.svg'
        },
        {
            id: 5,
            name: 'Big Ten',
            logo: '/bigten-logo.svg'
        },
    ];


    const getConferenceGames = () => {
		fetch('http://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard?limit=1000&dates=20231016-20231023&groups=' + selectedConference)
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
					winner: game.status.type.description == 'Final' ?
											(game.competitions[0].competitors[0].winner ? game.competitions[0].competitors[0].id : game.competitions[0].competitors[1].id) : '',
				})))
			})
	}

    useEffect(() => {
        console.log('selected conference', selectedConference);
        if(selectedConference) {
            getConferenceGames();
        }
    }, [selectedConference])

    let gamesList = games.map((game: any)=> {
		return <Game key={game.id} game={game} />
	});


	return (
		<div className="fixed top-0 right-0 bottom-0 left-0 z-20">
			<div className="absolute top-0 right-0 bottom-0 left-0 bg-slate-600 opacity-70"></div>
			<div className="absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 w-[600px] overflow-y-auto max-h-96">
                <div className="relative bg-white rounded p-8 drop-shadow">
                    <h2 className="text-2xl">Pick the games for Week {week}</h2>
                    <p>Which conference would you like to pick from?</p>
                    { conferences.map((conference: any, index: any) => {
                        return (
                            <div key={conference.id}>
                                <Image
                                    src={conference.logo}
                                    alt={conference.name}
                                    width={144}
                                    height={144}
                                    className="mr-3"
                                    onClick={() => setSelectedConference(conference.id)}
                                />
                            </div>
                        )
                    })}
                    <div className="grid gap-3 lg:grid-cols-3">{gamesList}</div>
                    { errorMsg && <div className="text-rose-600">{errorMsg}</div> }
				</div>
			</div>
		</div>
	)
}