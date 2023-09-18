import axios from "axios";
import { api } from "./api";
import OfficerService from "./OfficerService";

class TeamsService {


    async create(team, officers) {
        const officerService = new OfficerService();

        await api.post('/team', {
            team_name: team.team_name,
            status: 'A'
        }, {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json',
                Accept: "*/*"
            }
        }).then((result) => {
            console.log(result.team.id)

            // Create an array of promises for updating officers
            const updatePromises = officers.map((officer) => officerService.updateOfficer(officer));

            // Use Promise.all to execute all the update promises in parallel
            Promise.all(updatePromises)
                .then(() => {
                    console.log('All officers updated successfully.');
                })
                .catch((error) => {
                    console.error(`Error updating officers: ${error}`);
                });
        }).catch((error) => {
            console.error(`Error creating team: ${error}`);
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
            return result;
        } catch (error) {
            console.log(error)
        }

    }
}

export default TeamsService;