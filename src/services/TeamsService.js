import { api } from "./api";
import OfficerService from "./OfficerService";

class TeamsService {

    async create(team_name, officers) {
        const officerService = new OfficerService();

        var createdTeam = await api.post('/team', {
            team_name: team_name,
            status: 'A'
        }, {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json',
                Accept: "*/*"
            }
        })

        console.log(' created ---- ' + createdTeam)

        if (createdTeam) {


        }

        /*    
        .then((result) => {
            console.log(' linha 19 ---- ' + result)

            // Create an array of promises for updating officers
            const updatePromises = officers.map((officer) => officerService.updateOfficer(officer));

            // Use Promise.all to execute all the update promises in parallel
            Promise.all(updatePromises)
                .then((result) => {
                    console.log('All officers updated successfully.');
                    return result;
                })
                .catch((error) => {
                    console.error(`Error updating officers: ${error}`);
                });
        }).catch((error) => {
            console.error(`Error creating team: ${error}`);
        });*/

    }

    async deleteTeam(id) {
        await api.delete(`/team/${id}`, {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json',
                Accept: "*/*"
            }
        }).then((data) => {
            console.log(data);
            return data.data.message;
        }).catch((error) => {
            return error
        });
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