import Image from 'next/image';

export default function Game(props) {
	return (
		<div className="bg-white p-3.5 border-2 w-1/5">
            <div className="flex items-center">
                <Image
                    src={props.game.home_logo}
                    alt={props.game.home_team}
                    width={25}
                    height={25}
                    className="mr-2"
                />
                <span>{props.game.home_team}</span>
                {props.game.status.type.description != 'Scheduled' && <span>{props.game.home_score}</span>}
            </div>
            <div className="flex items-center">
                <Image
                    src={props.game.away_logo}
                    alt={props.game.away_team}
                    width={25}
                    height={25}
                    className="mr-2"
                />
            <span>{props.game.away_team}</span>
            {props.game.status.type.description != 'Scheduled' && <span>{props.game.away_score}</span>}
            </div>
		</div>
	)
}