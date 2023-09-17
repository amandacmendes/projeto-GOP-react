import { api } from "./api";

class ReasonService {

    async getReasonTypes() {
        const result = await api.get('/officer', {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json',
                Accept: "*/*"
            }
        });
        return result;
    }

    async getReasonfromOperation() {

        const officers = await api.get('/officer', {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json',
                Accept: "*/*"
            }
        });

        const teams = await api.get('/team', {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json',
                Accept: "*/*"
            }
        });

        // Create a mapping of teams by their id
        const teamMap = new Map();

        teams.data.forEach(team => {
            teamMap.set(team.id, team);
        });

        // Create a new array of officers with the nested team information
        const officersWithTeams = officers.data.map(officer => {
            const team = teamMap.get(officer.team_id);
            if (team) {
                // If a matching team is found, create a new object with the nested structure
                return {
                    ...officer,
                    team: {
                        id: team.id,
                        team_name: team.team_name,
                        status: team.status,
                        createdAt: team.createdAt,
                        updatedAt: team.updatedAt
                    }
                };
            } else {
                // If no matching team is found, simply return the officer object
                return officer;
            }
        });

        return officersWithTeams;
    }


}

export default ReasonService;