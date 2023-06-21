
export interface Game {
    game: {
        id: number,
        date?: string,
        home_rank: {
            current: number,
        },
        away_rank: {
            current: number,
        },
        home: {
            score: number,
            winner: boolean,
            team: {
                location: string,
                logo: string,
                color: string,
                displayName: string,
                abbreviation: string,
            },
            curatedRank: {
                current: number,
            }
        },
        away: {
            score: number,
            winner: boolean,
            team: {
                location: string,
                logo: string,
                color: string,
                displayName: string,
                abbreviation: string,
            },
            curatedRank: {
                current: number,
            }
        },
        status: {
            type: {
                completed: boolean,
                description: string,
                shortDetail: string,
            }
        }
        broadcast: string,
    }
}