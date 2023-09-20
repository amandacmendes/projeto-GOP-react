import { api } from "./api";
import OfficerService from "./OfficerService";

class TeamsService {


    async create(team) {

        const result = await api.post('/team', {
            team_name: team.team_name,
            status: 'A'
        }, {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json',
                Accept: "*/*"
            }
        })

        return result;
    }


    async update(team) {

        const result = await api.put(`/team/${team.id}`, {
            team_name: team.team_name,
            status: 'A'
        }, {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json',
                Accept: "*/*"
            }
        })

        return result;
    }

    async updateTeamAndTeamOfficers(team, officers) {
        const result = await api.put('/team', {
            team_name: team.team_name,
            status: 'A'
        }, {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json',
                Accept: "*/*"
            }
        }).then((result) => {

        })

        return result;
    }

    async delete(id) {

        //delete team
        const result = await api.delete(`/team/${id}`, {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json',
                Accept: "*/*"
            }
        })
        return result;
    }

    async getAllTeams() {
        const result = await api.get('/team', {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json',
                Accept: "*/*"
            }
        });
        return result;
    }

    async getTeamsWithOfficers() {
        try {

            const teams = await api.get('/team', {
                headers: {
                    Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                    'Content-Type': 'application/json',
                    Accept: "*/*"
                }
            });

            const officers = await api.get('/officer', {
                headers: {
                    Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                    'Content-Type': 'application/json',
                    Accept: "*/*"
                }
            });

            // Create a mapping of teams by their id
            const teamMap = new Map();

            teams.data.forEach(team => {
                teamMap.set(team.id, { ...team, officers: [] });
            });

            // Place officers inside their respective teams
            officers.data.forEach(officer => {
                const team = teamMap.get(officer.team_id);
                if (team) {
                    team.officers.push(officer);
                }
            });

            // Convert the teamMap values back to an array
            const result = Array.from(teamMap.values());
            //const result = teamMap;
            return result;

        } catch (error) {
            console.log(error)
        }

    }
}

export default TeamsService;