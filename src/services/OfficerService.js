import { api } from "./api";

class OfficerService {

    async getOfficers() {
        const accessToken = sessionStorage.getItem('token');
        const result = await api.get('/officer', {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json',
                Accept: "*/*"
            }
        });
        return result;
    }

    async getOfficersWithTeams() {
        const accessToken = sessionStorage.getItem('token');

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

    async deleteOfficer(id) {
        const accessToken = sessionStorage.getItem('token');
        const result = await api.delete(`/officer/${id}`, {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json',
                Accept: "*/*"
            }
        });
        return result;
    }

    async updateOfficer(data) {
        const accessToken = sessionStorage.getItem('token');
        const result = await api.put(`/officer/${data.id}`, {
            name: data.name,
            team_id: data.team_id
        }, {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json',
                Accept: "*/*"
            }
        });
        return result;
    }

    async createOfficer(data) {
        const accessToken = sessionStorage.getItem('token');
        const result = await api.post('/officer', {
            name: data.name,
            team_id: data.team_id
        }, {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json',
                Accept: "*/*"
            }
        });
        return result;
    }

}

export default OfficerService;