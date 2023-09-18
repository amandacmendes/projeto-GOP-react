import { api } from "./api";

class TeamsService {

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
            return result;
        } catch (error) {
            console.log(error)
        }

    }
}

export default TeamsService;