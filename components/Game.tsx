import Image from 'next/image';
import { Game } from '../types';

export default function Game(props: Game) {

	return (
        <div className="flex text-base shadow-md rounded-lg relative w-full">
            <div className="flex py-3 pl-4 w-1/2 items-center bg-white rounded-l-lg relative overflow-hidden">
                <Image
                    src={props.game.away.team.logo}
                    alt={props.game.away.team.location}
                    width={44}
                    height={44}
                    className="mr-3"
                />
                {props.game.status.type.description != 'Scheduled' && <div className="text-4xl pr-24">
                    {props.game.away.score}
                </div>}
                <div className="slash bg-slate-300 opacity-50 w-5 h-16 absolute -right-2.5 skew-y-[-82deg]"></div>
            </div>
            <div className="absolute left-2/4 top-2/4 -translate-y-2/4 -translate-x-2/4 bg-slate-600 text-white px-2 py-1 text-sm z-10">
                { props.game.status.type.description == 'Scheduled' && <span>{props.game.date} - {props.game.broadcast}</span> }
                { props.game.status.type.completed && <span>{props.game.status.type.shortDetail}</span>}
            </div>
            <div className="flex py-3 pr-4 w-1/2 justify-end items-center bg-slate-300 rounded-r-lg relative overflow-hidden">
                <div className="slash bg-white opacity-50 w-5 h-16 absolute -left-2.5 skew-y-[-82deg]"></div>
                {props.game.status.type.description != 'Scheduled' && <div className="text-4xl pl-24 text-white">
                    {props.game.home.score}
                </div>}
                <Image
                    src={props.game.home.team.logo}
                    alt={props.game.home.team.location}
                    width={44}
                    height={44}
                    className="ml-3"
                />
            </div>
        </div>
	)
}