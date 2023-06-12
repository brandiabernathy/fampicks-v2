import { useState } from 'react';
import { Game } from '../types';

export default function Game({game, selectTeam}) {
    
    function makeSelection(game: number, team: number) {
        selectTeam(game, team)
    }

	return (
        <div className="flex gap-8 relative w-full my-5">
            <div className="w-1/2 cursor-pointer" onClick={() => makeSelection(game.id, game.away.id)}>
                <div className="text-xs mb-1">
                    <div className="text-slate-500">Away</div>
                    <div className="font-bold">{game.away.team.displayName}</div>
                </div>
                <div className="rounded-lg text-center p-10" style={{ backgroundColor: `#${game.away.team.color}`}}>
                    <div className="text-white font-bold text-2xl">
                        { game.away_rank && <span>#{game.away_rank.current}</span> }
                        <span className="ml-2">{game.away.team.abbreviation}</span>
                    </div>
                </div>
            </div>
            <div className="w-1/2 cursor-pointer" onClick={() => makeSelection(game.id, game.home.id)}>
                <div className="text-xs text-right mb-1">
                    <div className="text-slate-500">Home</div>
                    <div className="font-bold">{game.home.team.displayName}</div>
                </div>
                <div className="rounded-lg text-center p-10" style={{ backgroundColor: `#${game.home.team.color}`}}>
                    <div className="text-white font-bold text-2xl">
                        { game.home_rank && <span>#{game.home_rank.current}</span> }
                        <span className="ml-2">{game.home.team.abbreviation}</span>
                    </div>
                </div>
            </div>
        </div>
	)
}